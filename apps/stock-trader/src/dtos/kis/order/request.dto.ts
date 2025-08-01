export class Order {
  /**
   * [종목 코드]
   */
  PDNO: string;
  /**
   * [주문 수량]
   */
  ORD_QTY: string;
  /**
   * [주문 단가]
   */
  OVRS_ORD_UNPR: string;
}

export class BuyOrderRequestDto extends Order {}

export class SellOrderRequestDto extends Order {}

export class PostOrderRequestDto extends Order {
  /**
   * [계좌번호 앞 8자리]
   */
  CANO: string;
  /**
   * [계좌번호 뒤 2자리]
   */
  ACNT_PRDT_CD: string;
  /**
   * [해외 거래소 코드]
   */
  OVRS_EXCG_CD: 'NASD';
  /**
   * [주문 구분]
   * 00: 지정가
   * 34: LOC(장마감지정가)
   */
  ORD_DVSN: '00' | '34';
  /**
   * [판매 유형]
   * undefined: 매수
   * 00: 매도
   */
  SLL_TYPE?: '00';
  /**
   * [주문 서버 구분 코드]
   * 0: 기본값
   */
  ORD_SVR_DVSN_CD: '0';
}
