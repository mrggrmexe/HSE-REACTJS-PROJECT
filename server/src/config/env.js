import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),

  JWT_SECRET: z.string().min(12, "JWT_SECRET must be at least 12 chars"),
  JWT_EXPIRES_IN: z.string().default("7d"),

  // optional
  CORS_ORIGIN: z.string().trim().min(1).optional(),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().min(1000).default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().int().min(1).default(300),

  CLIENT_BUILD_PATH: z.string().default("../client/dist")
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("[env] Invalid environment variables:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;

