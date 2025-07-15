import dotenv from "dotenv";

dotenv.config();

const DEFAULT_PORT = 3000;
export const config = {
  server: {
    PORT: parseInt(process.env.PORT ?? `${DEFAULT_PORT}`, 10),
  },
  kis: {
    API_BASE_URL: process.env.KIS_API_BASE_URL,
    APP_KEY: process.env.KIS_APP_KEY ?? "",
    APP_SECRET: process.env.KIS_APP_SECRET ?? "",
    WEB_SOCKET_URL: process.env.KIS_WEB_SOCKET_URL ?? "",
  },
};
