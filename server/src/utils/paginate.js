export function paginate(array, page, limit) {
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, Math.min(50, limit)); // защита от "дай 100000"

  const start = (safePage - 1) * safeLimit;
  const end = start + safeLimit;

  const items = array.slice(start, end);
  const total = array.length;
  const hasMore = end < total;

  return { items, page: safePage, limit: safeLimit, total, hasMore };
}

