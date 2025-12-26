import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { useServerGoods } from "../hooks/useServerGoods.js";
import GoodCard from "../components/GoodCard.jsx";

export default function GoodsPage() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const { items, loading, hasMore, connectionError, requestError, loadMore } = useServerGoods({
    token,
    initialLimit: 10
  });

  useEffect(() => {
    if (requestError?.status === 401) {
      logout();
      navigate("/login", { replace: true, state: { from: "/goods" } });
    }
  }, [logout, navigate, requestError?.status]);

  return (
    <div className="col" style={{ gap: 12 }}>
      <div className="card">
        <h2>Goods (Fruits)</h2>

        {loading && items.length === 0 && <p>Загрузка…</p>}
        {connectionError && <p className="error">Ошибка соединения</p>}
        {!connectionError && requestError && (
          <p className="error">Ошибка запроса: {requestError.message}</p>
        )}

        <div className="goodsGrid">
          {items.map((g) => (
            <GoodCard key={g.id} good={g} />  // key обязателен :contentReference[oaicite:3]{index=3}
          ))}
        </div>

        <div style={{ marginTop: 12 }}>
          <button onClick={loadMore} disabled={loading || !hasMore}>
            {loading && items.length > 0 ? "Загрузка…" : hasMore ? "Загрузить больше" : "Больше нет"}
          </button>
        </div>
      </div>
    </div>
  );
}
