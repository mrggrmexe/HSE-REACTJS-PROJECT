import { useCallback, useEffect, useRef, useState } from "react";
import { apiRequest, ApiError } from "../services/api.js";

export function useServerGoods({ token, initialLimit = 10 } = {}) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(false);

  // Требование ТЗ: "Ошибка соединения" именно при connection problem
  const [connectionError, setConnectionError] = useState(false);

  // Доп. ошибки (401/404/500 и т.п.)
  const [requestError, setRequestError] = useState(null);

  const abortRef = useRef(null);

  const loadPage = useCallback(
    async (nextPage) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setConnectionError(false);
      setRequestError(null);

      try {
        const data = await apiRequest(`/api/goods?page=${nextPage}&limit=${initialLimit}`, {
          token,
          signal: controller.signal
        });

        setItems((prev) => (nextPage === 1 ? data.items : [...prev, ...data.items]));
        setPage(data.page);
        setHasMore(Boolean(data.hasMore));
      } catch (e) {
        if (e?.name === "AbortError") return;

        if (e instanceof ApiError && e.code === "NETWORK") {
          setConnectionError(true);
        } else {
          setRequestError(e);
        }
      } finally {
        setLoading(false);
      }
    },
    [initialLimit, token]
  );

  useEffect(() => {
    // стартовая загрузка 10 товаров
    loadPage(1);
    return () => abortRef.current?.abort();
  }, [loadPage]);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    loadPage(page + 1);
  }, [hasMore, loadPage, loading, page]);

  const reload = useCallback(() => loadPage(1), [loadPage]);

  return {
    items,
    loading,
    hasMore,
    connectionError,
    requestError,
    loadMore,
    reload
  };
}
