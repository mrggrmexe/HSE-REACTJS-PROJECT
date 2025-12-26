import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import path from "path";
import fs from "fs";

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

  // Прокси может стоять перед Node, но для rate limit учитываем доверие к proxy
  app.set("trust proxy", 1);

  // Логгер (pino)
  const logger = pino({
    level: env.NODE_ENV === "production" ? "info" : "debug"
  });

  app.use(
    pinoHttp({
      logger,
      genReqId: (req) => req.headers["x-request-id"] ?? undefined
    })
  );

  // Вставляем requestId (аксесс-лог / trace)
  app.use(requestId());

  // Безопасные заголовки
  app.use(helmet());
  app.use(compression());
  app.use(express.json({ limit: "128kb" }));

  // CORS (если укажешь VITE_PROXY_TARGET в dev, то в prod можно отключить)
  if (env.CORS_ORIGIN) {
    app.use(
      cors({
        origin: env.CORS_ORIGIN,
        credentials: true
      })
    );
  }

  // Rate limit на API
  app.use("/api", apiLimiter());

  // ==== API ====
  app.use("/api", apiRouter);

  // ==== Static + SPA fallback ====

  // Путь к сборке React
  const buildRoot = path.resolve(process.cwd(), env.CLIENT_BUILD_PATH);

  // index.html должен существовать
  const indexHtml = path.join(buildRoot, "index.html");

  if (fs.existsSync(indexHtml)) {
    app.use(express.static(buildRoot));

    // Любой GET-запрос, который **не начинается с /api/** — отдаём index.html
    app.get(/^\/(?!api\/).*/, (req, res) => {
      res.sendFile(indexHtml);
    });
  } else {
    if (env.NODE_ENV !== "production") {
      console.warn(
        `[server] React build not found at: ${buildRoot}.` +
          ` Make sure to run "npm run build" in client.`
      );
    }
  }

  // 404 для прочих маршрутов
  app.use(notFound());

  // Глобальный error handler
  app.use(errorHandler());

  return app;
}
