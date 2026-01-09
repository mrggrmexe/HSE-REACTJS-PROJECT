import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireAuth } from "../middleware/auth.js";
import { listGoods, getGoodById } from "../controllers/goods.controller.js";

export const goodsRouter = Router();

// /api/goods?page=1&limit=10
goodsRouter.get("/goods", requireAuth(), asyncHandler(listGoods));

// /api/goods/:id
goodsRouter.get("/goods/:id", requireAuth(), asyncHandler(getGoodById));
