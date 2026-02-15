import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z
    .string()
    .default("6767")
    .transform((val) => Number(val)),
  YOUTUBE_API_KEY: z.string().min(1),
  DATABASE_URL: z.string().url(),
  EMAIL_USER: z.string().min(1),
  EMAIL_PASS: z.string().min(1),
  REDIS_HOST: z.string().min(1),
  REDIS_PORT: z.string().transform((val) => Number(val)),
  REDIS_USERNAME: z.string().min(1),
  REDIS_PASSWORD: z.string().min(1),
  JWT_SECRET: z.string().min(10),
  JWT_EXP: z.string().default("7d"),
  CORS_ALLOWED_ORIGINS: z
    .string()
    .min(1)
    .transform((val) => val.split(",").map((origin) => origin.trim())),
});

export type EnvSchema = z.infer<typeof envSchema>;
