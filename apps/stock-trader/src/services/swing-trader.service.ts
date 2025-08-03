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

    const myStocks = (await this.kisApiClient.getBalance()).output1;
    for (const { name, ticker, quantity } of config.strategy.swing.target) {
      const 이미_보유중인_종목 = myStocks.find(({ ovrs_pdno }) => ticker === ovrs_pdno);
      if (이미_보유중인_종목) {
        console.log(`${name} 종목은 이미 ${이미_보유중인_종목.ovrs_cblc_qty}주 보유중입니다. `);
        continue;
      }

      const { output2 } = await this.kisApiClient.getDailyPrice({ ticker });
      const dailyClosingPrices = output2.map(({ clos }) => Number(clos)).reverse();
      const rsis = this.indicatorService.calculateRSI({ prices: dailyClosingPrices });
      const currentRsi = rsis[rsis.length - 1];
      const currentPrice = dailyClosingPrices[dailyClosingPrices.length - 1];
      if (!currentRsi || !currentPrice) continue;

      if (this.isBuyable(currentRsi)) {
        console.log(`${name} 종목 ${currentPrice}원에 ${quantity}주 매수 진행`);
        await this.kisApiClient.buy({ ticker, quantity, price: currentPrice });
      }

      if (this.isSellable(currentRsi)) {
        console.log(`${name} 종목 ${currentPrice}원에 ${quantity}주 매도 진행`);
        await this.kisApiClient.sell({ ticker, quantity, price: currentPrice });
      }
    }

    console.log('--- 스윙 투자 종료 ---');
  }

  private isBuyable(rsi: number) {
    return rsi <= config.strategy.swing.condition.buy.rsi;
  }

  private isSellable(rsi: number) {
    return rsi >= config.strategy.swing.condition.sell.rsi;
  }
}
