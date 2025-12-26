import { z } from "zod";
import { GOODS } from "../data/goods.data.js";
import { paginate } from "../utils/paginate.js";
import { notFound } from "../utils/httpError.js";

const ListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10)
});

export async function listGoods(req, res, next) {
  const parsed = ListQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    // просто откатимся к дефолтам, чтобы сервер был "неубиваем"
    const data = paginate(GOODS, 1, 10);
    return res.json(data);
  }

  const { page, limit } = parsed.data;
  const data = paginate(GOODS, page, limit);
  res.json(data);
}

export async function getGoodById(req, res, next) {
  const id = String(req.params.id);
  const item = GOODS.find((g) => g.id === id);

  if (!item) return next(notFound("Good not found"));
  res.json(item);
}

