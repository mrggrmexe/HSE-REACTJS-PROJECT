import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import { env } from "./config/env.js";
import { requestId } from "./middleware/requestId.js";
import { apiLimiter } from "./middleware/rateLimiters.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { apiRouter } from "./routes/api.js";

import pino from "pino";
import pinoHttp from "pino-http";

export function createApp() {
  const app = express();

  // За прокси (Render/Heroku/Nginx) корректно определяем IP (важно для rate limit)
  app.set("trust proxy", 1);

  const logger = pino({
    level: env.NODE_ENV === "production" ? "info" : "debug"
  });

  app.use(
    pinoHttp({
      logger,
      genReqId: (req) => req.headers["x-request-id"] ?? undefined
    })
  );

  app.use(requestId());

  // Security headers (Helmet — best practice)
  app.use(helmet());
  app.use(compression());

  app.use(express.json({ limit: "128kb" }));

  // CORS нужен только если клиент отдельно (dev)
  if (env.CORS_ORIGIN) {
    app.use(
      cors({
        origin: env.CORS_ORIGIN,
        credentials: true
      })
    );
  }

  // Rate limit на /api
  app.use("/api", apiLimiter());

  // API
  app.use("/api", apiRouter);

  // ----- Serve React build (если есть) -----
  // Express static middleware (официальный способ)
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const buildDir = path.resolve(__dirname, "..", env.CLIENT_BUILD_PATH);
  const indexHtml = path.join(buildDir, "index.html");

  if (fs.existsSync(indexHtml)) {
    // статика
    app.use(
      express.static(buildDir, {
        maxAge: env.NODE_ENV === "production" ? "7d" : 0,
        etag: true
      })
    );

    // SPA fallback: всё, что НЕ /api, отдаём index.html
    app.get(/^\/(?!api\/).*/, (req, res) => {
      res.sendFile(indexHtml);
    });
  } else {
    if (env.NODE_ENV !== "production") {
      console.log(
        `[server] React build not found at: ${buildDir}. ` +
          `Build client and/or set CLIENT_BUILD_PATH.`
      );
    }
  }

  // 404 + error handler (в конце)
  app.use(notFound());
  app.use(errorHandler());

  return app;
}

