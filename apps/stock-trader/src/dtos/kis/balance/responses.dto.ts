export class GetBalanceResponseDto {
  /**
   * [성공 실패 여부]
   * - 0: 성공
   * - 나머지: 실패
   */
  rt_cd: string;
  /**
   * [응답코드]
   */
  msg_cd: string;
  /**
   * [응답메세지]
   */
  msg1: string;
  /**
   * [연속조회검색조건200]
   * - 빈 값으로 보내면 됨
   */
  ctx_area_fk200: string;
  /**
   * [연속조회키200]
   * - 빈 값으로 보내면 됨
   */
  ctx_area_nk200: string;
  output1: {
    /**
     * [티커]
     */
    ovrs_pdno: string;
    /**
     * [종목명]
     */
    ovrs_item_name: string;
    /**
     * [외화평가손익금액]
     * - 해당 종목의 매입금액과 평가금액의 외회기준 비교 손익
     */
    frcr_evlu_pfls_amt: string;
    /**
     * [평가손익율]
     * - 해당 종목의 평가손익을 기준으로 한 수익률
     */
    evlu_pfls_rt: string;
    /**
     * [매입평균가격]
     * - 해당 종목의 매수 평균 단가
     */
    pchs_avg_pric: string;
    /**
     * [해외잔고수량]
     */
    ovrs_cblc_qty: string;
    /**
     * [주문가능수량]
     * - 매도 가능한 주문 수량
     */
    ord_psbl_qty: string;
    /**
     * [외화매입금액]
     * - 해당 종목의 주식들을 사용하는 데에 소모한 총 금액
     */
    frcr_pchs_amt1: string;
    /**
     * [해외주식평가금액]
     * - 해당 종목의 주식들을 지금 당장 판매한다면 얻을 수 있는 총 금액
     */
    ovrs_stck_evlu_amt: string;
    /**
     * [현재가격]
     * - 해당 종목의 현재 가격
     */
    now_pric2: string;
    /**
     * [거래통화코드]
     */
    tr_crcy_cd: string;
    /**
     * [해외거래소코드]
     */
    ovrs_excg_cd: string;
  }[];
  output2: {};
}
