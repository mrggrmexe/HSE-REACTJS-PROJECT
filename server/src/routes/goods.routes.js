import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireAuth } from "../middleware/auth.js";
import { listGoods, getGoodById } from "../controllers/goods.controller.js";

export const goodsRouter = Router();

goodsRouter.get("/", requireAuth(), asyncHandler(listGoods));
goodsRouter.get("/:id", requireAuth(), asyncHandler(getGoodById));

