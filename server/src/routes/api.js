import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { goodsRouter } from "./goods.routes.js";
import { supportRouter } from "./support.js";

export const apiRouter = Router();

/**
 * Все роуты здесь монтируются под /api (см. app.js: app.use("/api", apiRouter))
 */
apiRouter.use(authRouter);
apiRouter.use(goodsRouter);
apiRouter.use(supportRouter);
