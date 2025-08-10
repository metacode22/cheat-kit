import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_PORT = 3000;
export const config = {
  server: {
    PORT: parseInt(process.env.PORT ?? `${DEFAULT_PORT}`, 10),
  },
  kis: {
    API_BASE_URL: process.env.KIS_API_BASE_URL,
    APP_KEY: process.env.KIS_APP_KEY ?? '',
    APP_SECRET: process.env.KIS_APP_SECRET ?? '',
    WEB_SOCKET_URL: process.env.KIS_WEB_SOCKET_URL ?? '',
  },
  account: {
    CANO: process.env.CANO ?? '',
    ACNT_PRDT_CD: process.env.ACNT_PRDT_CD ?? '',
  },
  strategy: {
    swing: {
      condition: {
        buy: { rsi: 27.5 },
        sell: { rsi: 70, profitRate: 5 },
      },
      target: [
        { name: 'ASML', ticker: 'ASML', quantity: 1 },
        { name: '어플라이드 머티리얼즈', ticker: 'AMAT', quantity: 2 },
        { name: '아마존', ticker: 'AMZN', quantity: 2 },
        { name: '에어비앤비', ticker: 'ABNB', quantity: 2 },
        { name: '스타벅스', ticker: 'SBUX', quantity: 2 },
        { name: '인텔', ticker: 'INTC', quantity: 10 },
        /**
         * @todo 월마트는 rsi가 30 이하로 잘 떨어지지 않음.
         * target들마다 따로 rsi를 설정할 수 있도록 수정 필요
         */
        { name: '월마트', ticker: 'WMT', quantity: 5 },
      ],
    },
  },
};
