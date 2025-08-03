export class GetDailyPriceResponseDto {
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
  output1: {
    /**
     * [실시간조회종목코드]
     * - 예: DNASAAPL
     */
    rsym: string;
    /**
     * [소수점자리수]
     */
    zdiv: string;
    /**
     * [전일종가]
     */
    nrec: string;
  };
  output2: {
    /**
     * [일자 (YYYYMMDD)]
     */
    xymd: string;
    /**
     * [종가]
     */
    clos: string;
    /**
     * [대비기호]
     * - 1: 상한
     * - 2: 상승
     * - 3: 보합
     * - 4: 하한
     * - 5: 하락
     */
    sign: string;
    /**
     * [대비 (전일 종가와의 차이)]
     */
    diff: string;
    /**
     * [등락율]
     */
    rate: string;
    /**
     * [시작가]
     */
    open: string;
    /**
     * [고가]
     */
    high: string;
    /**
     * [저가]
     */
    low: string;
    /**
     * [거래량]
     */
    tvol: string;
    /**
     * [거래대금]
     */
    tamt: string;
    /**
     * [매수호가]
     */
    pbid: string;
    /**
     * [매수호가잔량]
     */
    vbid: string;
    /**
     * [매도호가]
     */
    pask: string;
    /**
     * [매도호가잔량]
     */
    vask: string;
  }[];
}
