import puppeteer, { Browser, ElementHandle } from "puppeteer";
import { MAX_RETRY_COUNT, SECONDS, SELECTORS, URLS } from "./constants";
import { env } from "./env";
import fs from "fs";
import path from "path";

const SRT_아이디 = env.SRT_아이디;
const SRT_비밀번호 = env.SRT_비밀번호;
const 출발역 = env.출발역;
const 도착역 = env.도착역;
const 출발일 = env.출발일;
const 출발시간 = env.출발시간;
const 타겟_예매_유형들: TargetReservationTypes[] = env.타겟_예매_유형들;

type TargetReservationTypes = "입석+좌석" | "예약하기";

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

  // 팝업 닫기
  // await closePopup(browser);

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

  // 예약할 수 있을 때까지 반복
  let retry = 0;
  while (retry < MAX_RETRY_COUNT) {
    retry++;

    // table 태그가 없으면 '조회하기' 버튼 클릭
    const table = await page.$("table");
    if (!table) {
      const searchButton = await page.waitForSelector(`${SELECTORS.SEARCH_BUTTON}`);
      await searchButton?.click();
    }

    const rows = await page.$$("table tbody tr");
    for (let i = env.예약하고자_하는_기차_범위_시작 - 1; i < env.예약하고자_하는_기차_범위_종료; i++) {
      const row = rows[i];

      if (row) {
        const link = await row.$("td:nth-child(7) a");
        const span = await link?.$("span");
        const spanText = await span?.evaluate((element) => element.textContent);
        if (hasTargetReservationTypes(spanText)) {
          retry = MAX_RETRY_COUNT;

          /**
           * @description "입석+좌석"이 타겟일 경우 alert 뜰 수 있음. 이를 닫음.
           */
          page.on("dialog", async (dialog) => {
            if (dialog.type() === "alert") {
              await dialog.dismiss();
            }
          });

          await link?.click();
          await page.waitForNavigation();

          /**
           * @description 예약 성공 소리 재생
           */
          const successSound = fs.readFileSync(path.join(__dirname, "./success-sound.mp3"), { encoding: "base64" });
          const successSoundBase64 = `data:audio/mp3;base64,${successSound}`;

          await page.evaluate((successSoundBase64) => {
            const audio = new Audio(successSoundBase64);
            audio.play();
          }, successSoundBase64);

          break;
        }
      }
    }

    await wait(random(1 * SECONDS, 3 * SECONDS));
    await page.reload();

    if (retry > MAX_RETRY_COUNT) {
      console.log("최대 재시도 횟수 초과로 예약 실패");

      await browser.close();
      break;
    }
  }
}

main();

async function closePopup(browser: Browser) {
  return await new Promise((resolve) => {
    browser.on("targetcreated", async (target) => {
      const page = await target.page();
      await page?.close();

      resolve({ success: true });
    });
  });
}

function hasTargetReservationTypes(reservationType?: string | null) {
  return reservationType && 타겟_예매_유형들.includes(reservationType as TargetReservationTypes);
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
