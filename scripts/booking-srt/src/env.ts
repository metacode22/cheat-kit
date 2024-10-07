import z from "zod";
import { config } from "dotenv";
import path from "path";

const envPath = path.resolve(__dirname, "../.env");
config({ path: envPath });

export const envSchema = z.object({
  SRT_아이디: z.string(),
  SRT_비밀번호: z.string(),
  출발역: z.string(),
  도착역: z.string(),
  출발일: z.string(),
  출발시간: z.string(),
});

export const env = envSchema.parse({
  SRT_아이디: process.env.SRT_ID,
  SRT_비밀번호: process.env.SRT_PASSWORD,
  출발역: process.env.TARGET_DEPARTURE_STATION,
  도착역: process.env.TARGET_ARRIVAL_STATION,
  출발일: process.env.TARGET_DEPARTURE_DATE,
  출발시간: process.env.TARGET_DEPARTURE_TIME,
});
