import puppeteer, { Browser, ElementHandle } from "puppeteer";
import { env } from "./env";

const EXECUTABLE_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const SRT_아이디 = env.SRT_아이디;
const SRT_비밀번호 = env.SRT_비밀번호;
const URLS = {
  SRT_HOME_URL: "https://etk.srail.kr/cmc/01/selectLoginForm.do?pageId=TK0701000000",
  SRT_BOOKING_URL: "https://etk.srail.kr/hpg/hra/01/selectScheduleList.do?pageId=TK0101010000",
};
const SELECTORS = {
  ID_INPUT: "#srchDvNm01",
  PASSWORD_INPUT: "#hmpgPwdCphd01",
  CONFIRM_BUTTON: "input[type='submit']",
  DEPARTURE_STATION_INPUT: "#dptRsStnCdNm",
  ARRIVAL_STATION_INPUT: "#arvRsStnCdNm",
  TRAIN_TYPE_RADIO: "#trnGpCd300",
  DEPARTURE_DATE_INPUT: "#dptDt",
  DEPARTURE_TIME_INPUT: "#dptTm",
  SEARCH_BUTTON: "#search_top_tag > input",
};
const 출발역 = env.출발역;
const 도착역 = env.도착역;
const 출발일 = env.출발일;
const 출발시간 = env.출발시간;
const TARGET_RESERVATION_TYPE: ("입석+좌석" | "예약하기")[] = ["예약하기"];

async function main() {
  // 브라우저 실행
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--start-maximized"],
  });

  // 페이지 이동
  const page = await browser.newPage();
  await page.goto(URLS.SRT_HOME_URL);

  // 아이디 입력
  const idInput = await page.waitForSelector(SELECTORS.ID_INPUT);
  await idInput?.type(SRT_아이디);

  // 비밀번호 입력
  const passwordInput = await page.waitForSelector(SELECTORS.PASSWORD_INPUT);
  await passwordInput?.type(SRT_비밀번호);

  // 확인(로그인) 버튼 클릭
  const confirmButton = await page.waitForSelector(SELECTORS.CONFIRM_BUTTON);
  await confirmButton?.click();

  // 페이지 이동 대기
  await page.waitForNavigation();

  // 팝업들 닫기
  await closePopups(browser);

  // 예매 페이지 이동
  await page.goto(URLS.SRT_BOOKING_URL);

  // 출발역 입력
  const departureStationInput = (await page.waitForSelector(
    SELECTORS.DEPARTURE_STATION_INPUT,
  )) as ElementHandle<HTMLInputElement>;
  await departureStationInput.evaluate((element) => {
    element.value = "";
  });
  await departureStationInput.type(출발역);
  /**
   * @description srt 예매 사이트에서 onkeyup 이벤트가 따로 달려있음. 이 이벤트를 직접 발생시켜줘야 함. type 메서드로는 이벤트가 발생하지 않았음.
   */
  await departureStationInput?.evaluate((element) => {
    const event = new Event("keyup", { bubbles: true });
    element?.dispatchEvent(event);
  });

  // 도착역 입력
  const arrivalStationInput = (await page.waitForSelector(
    SELECTORS.ARRIVAL_STATION_INPUT,
  )) as ElementHandle<HTMLInputElement>;
  await arrivalStationInput.evaluate((element) => {
    element.value = "";
  });
  await arrivalStationInput.type(도착역);
  /**
   * @description 위 description과 동일
   */

  await arrivalStationInput?.evaluate((element) => {
    const event = new Event("keyup", { bubbles: true });
    element?.dispatchEvent(event);
  });

  // 차종구분 선택
  const trainTypeRadio = await page.waitForSelector(SELECTORS.TRAIN_TYPE_RADIO);
  await trainTypeRadio?.click();

  // 출발 날짜 선택
  const departureDateInput = await page.waitForSelector(SELECTORS.DEPARTURE_DATE_INPUT);
  await departureDateInput?.select(출발일);

  // 시간 선택
  const departureTimeInput = await page.waitForSelector(SELECTORS.DEPARTURE_TIME_INPUT);
  await departureTimeInput?.select(출발시간.padStart(2, "0") + "0000");

  // 조회하기 버튼 클릭
  const searchButton = await page.waitForSelector(`${SELECTORS.SEARCH_BUTTON}`);
  await searchButton?.click();
  if (!searchButton) await page.keyboard.press("Enter");

  // 페이지 이동 대기
  await page.waitForNavigation();

  /**
   * @todo 0이랑 9를 input으로 받을 수 있게 + 상수로 관리
   * @todo 매진 시 될 때까지 가능하도록
   */
  // 예약하기
  const rows = await page.$$("table tbody tr");
  for (let i = 0; i <= 9; i++) {
    const row = rows[i];

    if (row) {
      const link = await row.$("td:nth-child(7) a");
      const span = await link?.$("span");
      const spanText = await span?.evaluate((element) => element.textContent);
      if (spanText === "예약하기") {
        await link?.click();
        /**
         * @todo 소리 등으로 사용자에게 알리기
         */

        break;
      }
    }
  }
}

main();

async function closePopups(browser: Browser) {
  return await new Promise((resolve) => {
    let count = 0;

    browser.on("targetcreated", async (target) => {
      count++;
      const page = await target.page();
      await page?.close();
      count--;

      if (count === 0) resolve({ success: true });
    });
  });
}
