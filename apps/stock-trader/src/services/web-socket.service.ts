import { KisApiClient } from "@/clients/kis";
import { config } from "@/config";
import { Service } from "typedi";
import WebSocket from "ws";

@Service()
export class WebSocketService {
  private webSocket: WebSocket | null = null;
  private approvalKey: string | null = null;

  constructor(private readonly kisApiClient: KisApiClient) {}

  public async connect() {
    this.approvalKey = await this.kisApiClient.issueWebSocketApprovalKey();
    this.webSocket = new WebSocket(config.kis.WEB_SOCKET_URL);
    this.webSocket.on("open", () => {
      console.log("Web Socket connection established");
      if (!this.webSocket) return;

      this.webSocket.send(
        JSON.stringify({
          header: {
            approval_key: this.approvalKey,
            tr_type: "1",
            custtype: "P",
            "content-type": "utf-8",
          },
          body: {
            input: {
              tr_id: "HDFSCNT0",
              tr_key: "DNASAAPL",
            },
          },
        }),
      );
    });
    this.webSocket.on("message", (data: WebSocket.Data) => {
      const message = data.toString();
    });
  }
}
