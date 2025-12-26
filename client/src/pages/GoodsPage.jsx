import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { useServerGoods } from "../hooks/useServerGoods.js";

export default function GoodsPage() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const { items, loading, hasMore, connectionError, requestError, loadMore } = useServerGoods({
    token,
    initialLimit: 10
  });

  // Если токен протух/неверный и сервер вернул 401 — вылогиним
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

        <ul className="list">
          {items.map((g) => (
            <li key={g.id}>
              <Link to={`/goods/${g.id}`}>{g.name}</Link> — €{g.price} — {g.releaseDate}
            </li>
          ))}
        </ul>

        <div style={{ marginTop: 12 }}>
          <button onClick={loadMore} disabled={loading || !hasMore}>
            {loading && items.length > 0 ? "Загрузка…" : hasMore ? "Загрузить больше" : "Больше нет"}
          </button>
        </div>
      </div>
    </div>
  );
}

