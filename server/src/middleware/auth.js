import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { unauthorized } from "../utils/httpError.js";

export function requireAuth() {
  return (req, _res, next) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return next(unauthorized("Missing Authorization Bearer token"));
    }

    const token = header.slice("Bearer ".length).trim();

    // Для отладки/демо можно поддержать "demo-token"
    if (token === "demo-token") {
      req.user = { login: "demo" };
      return next();
    }

    try {
      const payload = jwt.verify(token, env.JWT_SECRET);
      req.user = payload;
      next();
    } catch {
      next(unauthorized("Invalid or expired token"));
    }
  };
}

