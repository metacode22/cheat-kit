import { config } from '@/config';
import { KIS_TR_ID } from '@/constants/kis';
import { PostAccessTokenResponseDto, PostWebSocketApprovalKeyResponseDto } from '@/dtos/kis/auth';
import { BuyOrderRequestDto, PostOrderRequestDto, SellOrderRequestDto } from '@/dtos/kis/order';
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

  public async buy({ PDNO, ORD_QTY, OVRS_ORD_UNPR }: BuyOrderRequestDto) {
    const accessToken = await this.authService.getAccessToken();
    const request: PostOrderRequestDto = {
      CANO: config.account.CANO,
      ACNT_PRDT_CD: config.account.ACNT_PRDT_CD,
      OVRS_EXCG_CD: 'NASD',
      PDNO,
      ORD_QTY,
      ORD_DVSN: '00',
      OVRS_ORD_UNPR,
      ORD_SVR_DVSN_CD: '0',
    };
    await kis.post('/uapi/overseas-stock/v1/trading/order', request, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        appkey: config.kis.APP_KEY,
        appsecret: config.kis.APP_SECRET,
        tr_id: KIS_TR_ID.미국_매수_주문,
        custtype: 'P',
      },
    });
  }

  public async sell({ PDNO, ORD_QTY, OVRS_ORD_UNPR }: SellOrderRequestDto) {
    const accessToken = await this.authService.getAccessToken();
    const request: PostOrderRequestDto = {
      CANO: config.account.CANO,
      ACNT_PRDT_CD: config.account.ACNT_PRDT_CD,
      OVRS_EXCG_CD: 'NASD',
      PDNO,
      ORD_QTY,
      ORD_DVSN: '00',
      OVRS_ORD_UNPR,
      ORD_SVR_DVSN_CD: '0',
      SLL_TYPE: '00',
    };
    await kis.post('/uapi/overseas-stock/v1/trading/order', request, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        appkey: config.kis.APP_KEY,
        appsecret: config.kis.APP_SECRET,
        tr_id: KIS_TR_ID.미국_매도_주문,
        custtype: 'P',
      },
    });
  }
}
