import { KisApiClient } from '@/clients/kis';
import { Service } from 'typedi';
import { IndicatorService } from './indicator.service';
import { config } from '@/config';

@Service()
export class SwingTraderService {
  constructor(
    private readonly kisApiClient: KisApiClient,
    private readonly indicatorService: IndicatorService,
  ) {}

  public async execute() {
    console.log('--- 스윙 투자 실행 ---');
    console.log('--- 매수 시도');
    await this.tryBuy();
    console.log('--- 매수 시도 완료');
    console.log('');
    console.log('--- 매도 시도');
    await this.trySell();
    console.log('--- 매도 시도 완료');
    console.log('-------------------');
  }

  private async tryBuy() {
    const myStocks = (await this.kisApiClient.getBalance()).output1;
    for (const { name, ticker, quantity, buyCondition, exchange } of config.strategy.swing.targets) {
      const 이미_보유중인_종목 = myStocks.find(({ ovrs_pdno }) => ticker === ovrs_pdno);
      if (이미_보유중인_종목) {
        console.log(`${name} 종목은 이미 ${이미_보유중인_종목.ovrs_cblc_qty}주 보유중입니다. `);
        continue;
      }

      const { output2 } = await this.kisApiClient.getDailyPrice({ ticker, exchange });
      const dailyClosingPrices = output2.map(({ clos }) => Number(clos)).reverse();
      const rsis = this.indicatorService.calculateRSI({ prices: dailyClosingPrices });
      const currentRsi = rsis[rsis.length - 1];
      const currentPrice = dailyClosingPrices[dailyClosingPrices.length - 1];
      console.log(name, 'rsi:', currentRsi, '현재 가격:', currentPrice);
      if (!currentRsi || !currentPrice) continue;

      if (currentRsi <= buyCondition.rsi) {
        await this.kisApiClient.buy({ ticker, quantity, price: currentPrice });
        console.log(`✅ ${name} 종목 ${currentPrice} 달러에 ${quantity}주 매수 진행 ✅`);
      }
    }
  }

  private async trySell() {
    const myStocks = (await this.kisApiClient.getBalance()).output1;
    for (const { name, ticker, quantity, sellCondition, exchange } of config.strategy.swing.targets) {
      const 이미_보유중인_종목 = myStocks.find(({ ovrs_pdno }) => ticker === ovrs_pdno);
      if (!이미_보유중인_종목) continue;

      const { output2 } = await this.kisApiClient.getDailyPrice({ ticker, exchange });
      const dailyClosingPrices = output2.map(({ clos }) => Number(clos)).reverse();
      const rsis = this.indicatorService.calculateRSI({ prices: dailyClosingPrices });
      const currentRsi = rsis[rsis.length - 1];
      const currentPrice = dailyClosingPrices[dailyClosingPrices.length - 1];
      if (!currentRsi || !currentPrice) continue;

      const averagePrice = Number(이미_보유중인_종목.pchs_avg_pric);
      const profitRate = this.indicatorService.calculateProfitRate({ currentPrice, averagePrice });
      console.log(name, 'rsi:', currentRsi, '현재 가격:', currentPrice, '수익률:', profitRate);
      if (profitRate > sellCondition.minimumProfitRate && currentRsi > sellCondition.rsi) {
        await this.kisApiClient.sell({ ticker, quantity, price: currentPrice });
        console.log(`⭐️ ${name} 종목 ${currentPrice} 달러에 ${quantity}주 매도 진행 ⭐️(최소 수익률 및 rsi 충족)`);
        continue;
      }

      if (profitRate > sellCondition.profitRate) {
        await this.kisApiClient.sell({ ticker, quantity, price: currentPrice });
        console.log(`⭐️ ${name} 종목 ${currentPrice} 달러에 ${quantity}주 매도 진행 ⭐️(수익률 충족)`);
      }
    }
  }
}
