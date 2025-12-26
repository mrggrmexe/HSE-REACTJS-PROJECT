import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "../config/env.js";
import { badRequest } from "../utils/httpError.js";

const LoginSchema = z.object({
  login: z.string().trim().min(1),
  password: z.string().trim().min(1)
});

export async function login(req, res, next) {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) {
    return next(badRequest("Invalid credentials payload", parsed.error.flatten().fieldErrors));
  }

  const { login: userLogin } = parsed.data;

  // Мок-проверка: любые непустые — ок
  const token = jwt.sign({ login: userLogin }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });

  res.json({
    token,
    user: { login: userLogin }
  });
}

