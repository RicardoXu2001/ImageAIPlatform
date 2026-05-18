import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  BACKEND_PORT: z.coerce.number().int().positive().default(4000),
  REDIS_HOST: z.string().default("127.0.0.1"),
  REDIS_PORT: z.coerce.number().int().positive().default(6379),
  REDIS_PASSWORD: z.string().optional(),
  LOCAL_STORAGE_DIR: z.string().default("./storage/generated"),
  PUBLIC_ASSET_BASE_URL: z.string().url().default("http://localhost:4000/generated"),
  OPENAI_IMAGE_MODEL: z.string().default("gpt-image-1"),
  DEMO_USER_EMAIL: z.string().email().default("demo@example.com"),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PRICE_PRO_MONTHLY: z.string().optional()
});

export const env = envSchema.parse(process.env);

export const redisConnection = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null
};
