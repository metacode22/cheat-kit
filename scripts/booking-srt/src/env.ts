import z from "zod";
import { config } from "dotenv";
import path from "path";

const envPath = path.resolve(__dirname, "../.env");
config({ path: envPath });

const envSchema = z.object({
  SRT_아이디: z.string(),
  SRT_비밀번호: z.string(),
  출발역: z.string(),
  도착역: z.string(),
  출발일: z.string().default(today()),
  출발시간: z.string().default("00"),
  예약하고자_하는_기차_범위_시작: z.coerce.number().min(1).max(10).default(1),
  예약하고자_하는_기차_범위_종료: z.coerce.number().min(1).max(10).default(10),
  타겟_예매_유형들: z.array(z.enum(["예약하기", "입석+좌석"])).default(["예약하기"]),
});

export const env = envSchema.parse({
  SRT_아이디: process.env.SRT_ID,
  SRT_비밀번호: process.env.SRT_PASSWORD,
  출발역: process.env.TARGET_DEPARTURE_STATION,
  도착역: process.env.TARGET_ARRIVAL_STATION,
  출발일: process.env.TARGET_DEPARTURE_DATE,
  출발시간: process.env.TARGET_DEPARTURE_TIME,
  예약하고자_하는_기차_범위_시작: process.env.TARGET_TRAIN_RANGE_START,
  예약하고자_하는_기차_범위_종료: process.env.TARGET_TRAIN_RANGE_END,
  타겟_예매_유형들: process.env.TARGET_RESERVATION_TYPES?.split(","),
});

function today() {
  const date = new Date();

  return (
    date.getFullYear().toString() +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    date.getDate().toString().padStart(2, "0")
  );
}
