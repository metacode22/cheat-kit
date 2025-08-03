import { config } from '@config';
import express from 'express';
import 'reflect-metadata';
import Container from 'typedi';
import { SwingTraderService } from './services/swing-trader.service';

async function start() {
  const app = express();
  app.listen(config.server.PORT, () => {
    console.log(`✅ Stock Trader app listening at http://localhost:${config.server.PORT}`);
  });
  app.get('/', (_, response) => {
    response.send('Hello, This is Stock Trader!');
  });

  const swingTraderService = Container.get(SwingTraderService);
  swingTraderService.execute();
}

start();
