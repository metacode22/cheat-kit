import { Service } from 'typedi';

const TWO_WEEK_DAYS = 14;

@Service()
export class IndicatorService {
  public calculateRSI({ prices, period = TWO_WEEK_DAYS }: { prices: number[]; period?: number }) {
    if (prices.length <= period) {
      console.log('rsi 계산을 위한 데이터 부족');
      return [];
    }

    const rsis: number[] = [];
    const gains: number[] = [];
    const losses: number[] = [];

    // period 만큼의 데이터들 계산
    for (let i = 1; i <= period; i++) {
      const difference = (prices[i] ?? 0) - (prices[i - 1] ?? 0);
      if (difference > 0) {
        gains.push(difference);
        losses.push(0);
      } else {
        gains.push(0);
        losses.push(Math.abs(difference));
      }
    }

    let averageGains = gains.reduce((sum, gain) => sum + gain, 0) / period;
    let averageLosses = losses.reduce((sum, loss) => sum + loss, 0) / period;
    const rs = averageLosses === 0 ? Infinity : averageGains / averageLosses;
    const firstRsi = 100 - 100 / (1 + rs);
    rsis.push(firstRsi);

    // period 이후의 데이터들 계산
    for (let i = period + 1; i < prices.length; i++) {
      const difference = (prices[i] ?? 0) - (prices[i - 1] ?? 0);
      let currentGain = 0;
      let currentLoss = 0;

      if (difference > 0) {
        currentGain = difference;
      } else {
        currentLoss = Math.abs(difference);
      }

      averageGains = (averageGains * (period - 1) + currentGain) / period;
      averageLosses = (averageLosses * (period - 1) + currentLoss) / period;

      const rs = averageLosses === 0 ? Infinity : averageGains / averageLosses;
      const rsi = 100 - 100 / (1 + rs);
      rsis.push(rsi);
    }

    return rsis;
  }

  /**
   * % 단위로 반환
   */
  public calculateProfitRate({ currentPrice, averagePrice }: { currentPrice: number; averagePrice: number }) {
    return ((currentPrice - averagePrice) / averagePrice) * 100;
  }
}
