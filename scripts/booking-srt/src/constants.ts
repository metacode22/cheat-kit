export const URLS = {
  SRT_HOME_URL: "https://etk.srail.kr/cmc/01/selectLoginForm.do?pageId=TK0701000000",
  SRT_BOOKING_URL: "https://etk.srail.kr/hpg/hra/01/selectScheduleList.do?pageId=TK0101010000",
};

export const SELECTORS = {
  ID_INPUT: "#srchDvNm01",
  PASSWORD_INPUT: "#hmpgPwdCphd01",
  CONFIRM_BUTTON: "input[type='submit']",
  DEPARTURE_STATION_INPUT: "#dptRsStnCdNm",
  ARRIVAL_STATION_INPUT: "#arvRsStnCdNm",
  TRAIN_TYPE_RADIO: "#trnGpCd300",
  DEPARTURE_DATE_INPUT: "#dptDt",
  DEPARTURE_TIME_INPUT: "#dptTm",
  SEARCH_BUTTON: "#search_top_tag > input",
  NO_SEAT_TEXT: "잔여석없음",
  CONFIRM_BUTTON_WHEN_NO_SEAT: "#wrap > div.container.container-e > div > div.sub_con_area > div:nth-child(7) > a",
};

export const MAX_RETRY_COUNT = 3000;

export const SECONDS = 1000;
