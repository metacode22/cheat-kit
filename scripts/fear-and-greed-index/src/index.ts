import puppeteer from "puppeteer";
import nodemailer from "nodemailer";
import { env } from "./env";

async function main() {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.goto("https://www.cnn.com/markets/fear-and-greed");

  const fearAndGreedIndexTag = await page.waitForSelector(
    "body > div.layout__content-wrapper.layout-with-rail__content-wrapper > section.layout__wrapper.layout-with-rail__wrapper > section.layout__main-wrapper.layout-with-rail__main-wrapper > section.layout__main.layout-with-rail__main > div > section > div.market-tabbed-container > div.market-tabbed-container__content > div.market-tabbed-container__tab.market-tabbed-container__tab--1 > div > div.market-fng-gauge__overview > div.market-fng-gauge__meter-container > div > div.market-fng-gauge__dial-number > span",
  );
  const fearAndGreedIndex = await page.evaluate((element) => element?.textContent, fearAndGreedIndexTag);
  const fearAndGreedLevel = getFearAndGreedLevel(Number(fearAndGreedIndex));

  await browser.close();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "alohajune22@gmail.com",
      pass: env.GOOGLE_APP_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: "alohajune22@gmail.com",
      to: ["alohajune22@gmail.com"],
      subject: `공포탐욕지수: ${fearAndGreedIndex}, ${fearAndGreedLevel}`,
      text: `공포탐욕지수: ${fearAndGreedIndex}, ${fearAndGreedLevel}`,
    });
  } catch (error) {
    console.error(error);
  }
}

main();

function getFearAndGreedLevel(value: number) {
  const ranges = [
    { min: 0, max: 24, level: "Extreme Fear" },
    { min: 25, max: 44, level: "Fear" },
    { min: 45, max: 54, level: "Neutral" },
    { min: 55, max: 74, level: "Greedy" },
    { min: 75, max: 100, level: "Extreme Greed" },
  ];

  return ranges.find((range) => value >= range.min && value <= range.max)?.level ?? "Invalid value";
}
