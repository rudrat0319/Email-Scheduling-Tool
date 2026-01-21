import { z } from "zod";

const durationRegex = /^(\d+)(ms|s|m|h|d|w|y)$/;

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  POST: z.string().default("3000"),

  DB_HOST: z.string(),
  DB_PORT: z.string().default("5432"),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),

  REDIS_NAME: z.string(),
  REDIS_PORT: z.string().default("6379"),
  REDIS_PASSWORD: z.string().optional(),

  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),

  JWT_EXPIRES_IN: z.string().default("7d"),


  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;