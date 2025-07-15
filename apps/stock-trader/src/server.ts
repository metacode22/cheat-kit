import "reflect-metadata";
import express from "express";
import { config } from "@config";

const app = express();

app.listen(config.server.PORT, () => {
  console.log(`Stock Trader app listening at http://localhost:${config.server.PORT}`);
});

app.get("/", (_, response) => {
  response.send("Hello, This is Stock Trader!");
});

// import "reflect-metadata";
// import Container from "typedi";
// import { WebSocketService } from "./services/web-socket.service";
// import express from "express";
// import { config } from "./config";

// async function startServer() {
//   const webSocketService = Container.get(WebSocketService);
//   await webSocketService.connect();

//   const app = express();
//   app.listen(config.server.PORT, () => {
//     console.log(`✅ Stock Trader app listening at http://localhost:${config.server.PORT}`);
//   });
//   app.get("/", (_, response) => {
//     response.send("Hello, This is Stock Trader!");
//   });
// }

// startServer();
