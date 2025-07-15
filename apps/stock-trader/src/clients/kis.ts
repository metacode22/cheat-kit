import { config } from "@/config";
import { PostAccessTokenResponseDto, PostWebSocketApprovalKeyResponseDto } from "@/dtos/kis/auth";
import axios from "axios";
import { parse } from "date-fns";
import { Service } from "typedi";

const kis = axios.create({ baseURL: config.kis.API_BASE_URL });

@Service()
export class KisApiClient {
  public async issueAccessToken() {
    const response = await kis.post<PostAccessTokenResponseDto>("/oauth2/tokenP", {
      grant_type: "client_credentials",
      appkey: config.kis.APP_KEY,
      appsecret: config.kis.APP_SECRET,
    });
    const { access_token, access_token_token_expired } = response.data;
    const accessTokenExpiresAt = parse(access_token_token_expired, "yyyy-MM-dd HH:mm:ss", new Date());

    return { accessToken: access_token, accessTokenExpiresAt };
  }

  public async issueWebSocketApprovalKey() {
    const {
      data: { approval_key },
    } = await kis.post<PostWebSocketApprovalKeyResponseDto>("/oauth2/Approval", {
      grant_type: "client_credentials",
      appkey: config.kis.APP_KEY,
      secretkey: config.kis.APP_SECRET,
    });

    return approval_key;
  }
}
