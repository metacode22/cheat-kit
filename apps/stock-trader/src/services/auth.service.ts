import { KisApiClient } from "@/clients/kis";
import { ONE_MINUTE } from "@/constants/time";
import { Service } from "typedi";

@Service()
export class AuthService {
  private accessToken: string | null = null;
  private accessTokenExpiresAt: Date | null = null;

  constructor(private readonly kisApiClient: KisApiClient) {}

  public async getAccessToken() {
    const 토큰이_현재보다_1분_이상_남았다면 =
      this.accessTokenExpiresAt && (this.accessTokenExpiresAt?.getTime() ?? 0) > Date.now() + ONE_MINUTE;
    if (this.accessToken && 토큰이_현재보다_1분_이상_남았다면) return this.accessToken;

    return this.issueAccessToken();
  }

  private async issueAccessToken() {
    const { accessToken, accessTokenExpiresAt } = await this.kisApiClient.issueAccessToken();
    this.accessToken = accessToken;
    this.accessTokenExpiresAt = accessTokenExpiresAt;

    return this.accessToken;
  }
}
