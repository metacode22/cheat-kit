import { config } from '@/config';
import { PostAccessTokenResponseDto, PostWebSocketApprovalKeyResponseDto } from '@/dtos/kis/auth';
import { AuthService } from '@/services/auth.service';
import axios from 'axios';
import { parse } from 'date-fns';
import { Service } from 'typedi';

const kis = axios.create({ baseURL: config.kis.API_BASE_URL });

@Service()
export class KisApiClient {
  constructor(private readonly authService: AuthService) {}

  public async issueAccessToken() {
    const response = await kis.post<PostAccessTokenResponseDto>('/oauth2/tokenP', {
      grant_type: 'client_credentials',
      appkey: config.kis.APP_KEY,
      appsecret: config.kis.APP_SECRET,
    });
    const { access_token, access_token_token_expired } = response.data;
    const accessTokenExpiresAt = parse(access_token_token_expired, 'yyyy-MM-dd HH:mm:ss', new Date());

    return { accessToken: access_token, accessTokenExpiresAt };
  }

  public async issueWebSocketApprovalKey() {
    const {
      data: { approval_key },
    } = await kis.post<PostWebSocketApprovalKeyResponseDto>('/oauth2/Approval', {
      grant_type: 'client_credentials',
      appkey: config.kis.APP_KEY,
      secretkey: config.kis.APP_SECRET,
    });

    return approval_key;
  }

  /**
   * @todo request dto 정의
   */
  public async buy() {
    const accessToken = await this.authService.getAccessToken();
    console.log('🚀 ~ KisApiClient ~ buy ~ accessToken:', accessToken);
    try {
      const { data } = await kis.post(
        '/uapi/overseas-stock/v1/trading/order',
        {
          CANO: config.account.CANO,
          ACNT_PRDT_CD: config.account.ACNT_PRDT_CD,
          OVRS_EXCG_CD: 'NASD',
          PDNO: 'SDST', // 스타더스트 파워
          ORD_QTY: '1',
          ORD_DVSN: '00',
          OVRS_ORD_UNPR: '0.1',
          ORD_SVR_DVSN_CD: "0"
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            appkey: config.kis.APP_KEY,
            appsecret: config.kis.APP_SECRET,
            tr_id: 'TTTT1002U',
            custtype: 'P',
          },
        },
      );
      console.log('🚀 ~ KisApiClient ~ buy ~ data:', data);
    } catch (error) {
      console.error('Error during buy operation:', error);
    }
  }

  public async sell() {}
}
