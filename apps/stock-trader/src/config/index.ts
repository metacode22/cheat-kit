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
        buy: { rsi: 30 },
        sell: { rsi: 70 },
      },
      target: [
        { name: 'ASML', ticker: 'ASML', quantity: 1 },
        // { name: '어플라이드 머티리얼즈', ticker: 'AMAT', quantity: 2 },
        // { name: '아마존', ticker: 'AMZN', quantity: 2 },
      ],
    },
  },
};
