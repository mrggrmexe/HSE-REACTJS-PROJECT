import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { goodsRouter } from "./goods.routes.js";

export const apiRouter = Router();

apiRouter.get("/health", (_req, res) => res.json({ ok: true }));

apiRouter.use(authRouter);
apiRouter.use("/goods", goodsRouter);

