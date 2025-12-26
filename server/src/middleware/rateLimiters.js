import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";

export function apiLimiter() {
  return rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many requests" }
  });
}

// Можно отдельный лимитер на логин (жёстче)
export function loginLimiter() {
  return rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many login attempts" }
  });
}

