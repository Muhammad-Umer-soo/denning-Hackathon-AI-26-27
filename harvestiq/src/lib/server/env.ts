import { z } from "zod";

const envSchema = z.object({
  // AI / LLM
  OPENROUTER_API_KEY: z.string().optional(),

  // Database
  DATABASE_URL: z.string().optional(),

  // External Service Keys (server-side only, never exposed to client)
  GITHUB_PERSONAL_ACCESS_TOKEN: z.string().optional(),
  NEON_API_KEY: z.string().optional(),
  STITCH_API_KEY: z.string().optional(),

  // Application
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_ENV: z.enum(["development", "preview", "production", "test"]).default("development"),
  PILOT_REGION: z.string().default("Punjab (Multan / Faisalabad Belt), Pakistan"),
});

function getValidatedEnv() {
  const result = envSchema.safeParse({
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    GITHUB_PERSONAL_ACCESS_TOKEN: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
    NEON_API_KEY: process.env.NEON_API_KEY,
    STITCH_API_KEY: process.env.STITCH_API_KEY,
    NODE_ENV: process.env.NODE_ENV,
    APP_ENV: process.env.APP_ENV,
    PILOT_REGION: process.env.PILOT_REGION,
  });

  if (!result.success) {
    console.error("❌ Invalid environment variables:", result.error.format());
    throw new Error("Invalid environment configuration");
  }

  return result.data;
}

export const serverEnv = getValidatedEnv();
