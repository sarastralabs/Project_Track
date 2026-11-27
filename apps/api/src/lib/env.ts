import "server-only";

import { z } from "zod";

/**
 * All server env vars are validated here.
 * Import `env` from server code only — never expose secrets to the client.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  /** Public URL browsers use for auth (web app origin when /api is rewritten). */
  APP_URL: z.url().default("http://localhost:3001"),
  /** Extra trusted web origins for Better Auth (comma-separated). */
  WEB_ORIGIN: z.string().default("http://localhost:3001"),
  /** Mongo connection — local Docker uses host port 28018 + directConnection. */
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  /** Logical database name inside Mongo. */
  MONGODB_DB_NAME: z.string().min(1).default("sarastra_hub"),
  /** Better Auth signing secret (min 32 chars). */
  BETTER_AUTH_SECRET: z.string().min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const parsed = envSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    APP_URL: process.env.APP_URL,
    WEB_ORIGIN: process.env.WEB_ORIGIN,
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_DB_NAME: process.env.MONGODB_DB_NAME,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  });

  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid environment variables:\n${details}`);
  }

  return parsed.data;
}

export const env = loadEnv();