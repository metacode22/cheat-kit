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
      targets: [
        {
          name: 'ASML',
          ticker: 'ASML',
          exchange: 'NAS',
          quantity: 1,
          buyCondition: { rsi: 31 },
          sellCondition: { rsi: 68.5, minimumProfitRate: 5, profitRate: 12 },
        },
        {
          name: '어플라이드 머티리얼즈',
          ticker: 'AMAT',
          exchange: 'NAS',
          quantity: 2,
          buyCondition: { rsi: 31 },
          sellCondition: { rsi: 71, minimumProfitRate: 5, profitRate: 15 },
        },
        {
          name: '아마존',
          ticker: 'AMZN',
          exchange: 'NAS',
          quantity: 2,
          buyCondition: { rsi: 35 },
          sellCondition: { rsi: 67, minimumProfitRate: 5, profitRate: 15 },
        },
        {
          name: '에어비앤비',
          ticker: 'ABNB',
          exchange: 'NAS',
          quantity: 2,
          buyCondition: { rsi: 27.5 },
          sellCondition: { rsi: 68.5, minimumProfitRate: 5, profitRate: 10 },
        },
        {
          name: '스타벅스',
          ticker: 'SBUX',
          exchange: 'NAS',
          quantity: 2,
          buyCondition: { rsi: 27 },
          sellCondition: { rsi: 70, minimumProfitRate: 5, profitRate: 10 },
        },
        {
          name: '인텔',
          ticker: 'INTC',
          exchange: 'NAS',
          quantity: 10,
          buyCondition: { rsi: 27.5 },
          sellCondition: { rsi: 70, minimumProfitRate: 5, profitRate: 10 },
        },
        /**
         * @todo 월마트는 거래소가 달라서 그런지 현재 조회가 잘 되지 않음.
         */
        // {
        //   name: '월마트',
        //   ticker: 'WMT',
        //   exchange: 'NYS',
        //   quantity: 5,
        //   buyCondition: { rsi: 36 },
        //   sellCondition: { rsi: 72, minimumProfitRate: 5, profitRate: 10 },
        // },
      ],
    },
  },
} as const;
