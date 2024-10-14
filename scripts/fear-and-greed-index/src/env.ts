import z from "zod";
import { config } from "dotenv";
import path from "path";

const envPath = path.resolve(__dirname, "../.env");
config({ path: envPath });

const envSchema = z.object({
  GOOGLE_APP_PASSWORD: z.string(),
});

export const env = envSchema.parse({
  GOOGLE_APP_PASSWORD: process.env.GOOGLE_APP_PASSWORD,
});
