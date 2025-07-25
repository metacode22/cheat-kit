import puppeteer from 'puppeteer';
import nodemailer from 'nodemailer';
import { env } from './env';

async function main() {
  await wait(random(0, 300_000)); // 0초 ~ 5분, 크롤링 차단 방지

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    protocolTimeout: 300000,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
  });
  const page = await browser.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  ); // fake user agent
  await page.goto('https://www.cnn.com/markets/fear-and-greed', {
    timeout: 300000,
  });

  const fearAndGreedIndexTag = await page.waitForSelector('.market-fng-gauge__dial-number-value', {
    timeout: 300000,
  });
  const fearAndGreedIndex = await page.evaluate((element) => element?.textContent, fearAndGreedIndexTag);
  const fearAndGreedLevel = getFearAndGreedLevel(Number(fearAndGreedIndex));

  await browser.close();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'alohajune22@gmail.com',
      pass: env.GOOGLE_APP_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: 'alohajune22@gmail.com',
      // to: ['alohajune22@gmail.com', 'junhwan.seo@teamsparta.co', 'st.oh@teamsparta.co'],
      to: ['alohajune22@gmail.com'],
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
    { min: 0, max: 24, level: 'Extreme Fear' },
    { min: 25, max: 44, level: 'Fear' },
    { min: 45, max: 54, level: 'Neutral' },
    { min: 55, max: 74, level: 'Greedy' },
    { min: 75, max: 100, level: 'Extreme Greed' },
  ];

  return ranges.find((range) => value >= range.min && value <= range.max)?.level ?? 'Invalid value';
}

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
