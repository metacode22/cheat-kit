import { KisApiClient } from '@/clients/kis';
import { config } from '@/config';
import { KIS_WEB_SOCKET_TR_ID } from '@/constants/kis';
import { Service } from 'typedi';
import WebSocket from 'ws';

@Service()
export class WebSocketService {
  private webSocket: WebSocket | null = null;
  private approvalKey: string | null = null;
  private subscribedTickers = new Set<string>();
  private currentPrices = new Map<string, number>();

  constructor(private readonly kisApiClient: KisApiClient) {}

  public async connect() {
    this.approvalKey = await this.kisApiClient.issueWebSocketApprovalKey();
    this.webSocket = new WebSocket(config.kis.WEB_SOCKET_URL);

    this.webSocket.on('open', () => console.log('웹소켓 연결 성공'));
    this.webSocket.on('message', (data: WebSocket.Data) => this.handleMessage(data));
    this.webSocket.on('error', (error) => console.error('웹소켓 에러 발생:', error));
    this.webSocket.on('close', () => console.log('웹소켓 연결 종료'));
  }

  public async subscribe({ tickers }: { tickers: string[] }) {
    if (!this.webSocket || this.webSocket.readyState !== WebSocket.OPEN)
      throw new Error('웹소켓 연결 상태가 올바르지 않습니다.');

    tickers.forEach((ticker) => {
      if (this.subscribedTickers.has(ticker)) return;
      if (!this.webSocket) return;

      const request = {
        header: { approval_key: this.approvalKey, custtype: 'P', tr_type: '1', 'content-type': 'utf-8' },
        body: { input: { tr_id: KIS_WEB_SOCKET_TR_ID.해외주식_실시간지연체결가, tr_key: `DNAS${ticker}` } },
      };

      this.webSocket.send(JSON.stringify(request));
      this.subscribedTickers.add(ticker);
      console.log('구독 요청 완료: ', ticker);
    });
  }

  public getCurrentPrice({ ticker }: { ticker: string }) {
    return this.currentPrices.get(ticker);
  }

  private handleMessage(data: WebSocket.Data) {
    const message = data.toString();
    if (!message.startsWith(`0|${KIS_WEB_SOCKET_TR_ID.해외주식_실시간지연체결가}|`)) return;

    const parts = message.split('|');
    const dataFields = parts[3]?.split('^');
    const ticker = dataFields?.[1];
    const zdiv = dataFields?.[2];
    const price = dataFields?.[11];
    if (!ticker || !zdiv || !price) return;

    const actualPrice = Number(price) / 10 ** Number(zdiv);
    this.currentPrices.set(ticker, actualPrice);
    console.log(`실시간 체결에 따른 ${ticker} 가격 업데이트: ${actualPrice}`);
  }
}
