import { config } from '@/config';
import { KIS_TR_ID } from '@/constants/kis';
import { PostAccessTokenResponseDto, PostWebSocketApprovalKeyResponseDto } from '@/dtos/kis/auth';
import { GetBalanceResponseDto } from '@/dtos/kis/balance/responses.dto';
import { BuyOrderRequestDto, PostOrderRequestDto, SellOrderRequestDto } from '@/dtos/kis/order';
import { GetDailyPriceResponseDto } from '@/dtos/kis/price';
import { GetDailyPriceRequestDto } from '@/dtos/kis/price/requests.dto';
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

  public async buy({ ticker, quantity, price }: BuyOrderRequestDto) {
    const accessToken = await this.authService.getAccessToken();
    const request: PostOrderRequestDto = {
      CANO: config.account.CANO,
      ACNT_PRDT_CD: config.account.ACNT_PRDT_CD,
      OVRS_EXCG_CD: 'NASD',
      PDNO: ticker,
      ORD_QTY: quantity.toString(),
      ORD_DVSN: '00',
      OVRS_ORD_UNPR: price.toString(),
      ORD_SVR_DVSN_CD: '0',
    };
    const response = await kis.post('/uapi/overseas-stock/v1/trading/order', request, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        appkey: config.kis.APP_KEY,
        appsecret: config.kis.APP_SECRET,
        tr_id: KIS_TR_ID.미국_매수_주문,
        custtype: 'P',
      },
    });
    console.log(response.data);
  }

  public async sell({ ticker, quantity, price }: SellOrderRequestDto) {
    const accessToken = await this.authService.getAccessToken();
    const request: PostOrderRequestDto = {
      CANO: config.account.CANO,
      ACNT_PRDT_CD: config.account.ACNT_PRDT_CD,
      OVRS_EXCG_CD: 'NASD',
      PDNO: ticker,
      ORD_QTY: quantity.toString(),
      ORD_DVSN: '00',
      OVRS_ORD_UNPR: price.toString(),
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

  public async getBalance() {
    const accessToken = await this.authService.getAccessToken();
    const { data } = await kis.get<GetBalanceResponseDto>('/uapi/overseas-stock/v1/trading/inquire-balance', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        appkey: config.kis.APP_KEY,
        appsecret: config.kis.APP_SECRET,
        tr_id: KIS_TR_ID.해외주식_잔고조회,
      },
      params: {
        CANO: config.account.CANO,
        ACNT_PRDT_CD: config.account.ACNT_PRDT_CD,
        OVRS_EXCG_CD: 'NASD',
        TR_CRCY_CD: 'USD',
        CTX_AREA_FK200: '',
        CTX_AREA_NK200: '',
      },
    });

    return data;
  }

  public async getDailyPrice({ ticker }: GetDailyPriceRequestDto) {
    const accessToken = await this.authService.getAccessToken();
    const { data } = await kis.get<GetDailyPriceResponseDto>('/uapi/overseas-price/v1/quotations/dailyprice', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        appkey: config.kis.APP_KEY,
        appsecret: config.kis.APP_SECRET,
        tr_id: KIS_TR_ID.해외주식_기간별시세,
      },
      params: {
        EXCD: 'NAS',
        SYMB: ticker,
        GUBN: '0',
        MODP: '1',
        BYMD: '',
      },
    });

    return data;
  }
}
