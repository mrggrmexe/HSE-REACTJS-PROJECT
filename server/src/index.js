import http from "http";
import { createApp } from "./app.js";
import { env } from "./config/env.js";

const app = createApp();
const server = http.createServer(app);

server.listen(env.PORT, () => {
  console.log(`[server] listening on http://localhost:${env.PORT} (${env.NODE_ENV})`);
});

// ---- Graceful shutdown ----
function shutdown(signal) {
  console.log(`[server] received ${signal}, shutting down...`);
  server.close((err) => {
    if (err) {
      console.error("[server] error during shutdown:", err);
      process.exit(1);
    }
    process.exit(0);
  });

  // на всякий случай — если зависли коннекты
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("unhandledRejection", (reason) => {
  console.error("[server] unhandledRejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("[server] uncaughtException:", err);
  // обычно лучше завершить процесс, чем жить в неизвестном состоянии
  process.exit(1);
});

