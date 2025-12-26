import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { login } from "../controllers/auth.controller.js";
import { loginLimiter } from "../middleware/rateLimiters.js";

export const authRouter = Router();

authRouter.post("/login", loginLimiter(), asyncHandler(login));

