import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { apiRequest, ApiError } from "../services/api.js";

export default function GoodDetailsPage() {
  const { id } = useParams();
  const { token, logout } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [errorText, setErrorText] = useState("");

  const abortRef = useRef(null);

  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setConnectionError(false);
    setErrorText("");
    setItem(null);

    apiRequest(`/api/goods/${id}`, { token, signal: controller.signal })
      .then(setItem)
      .catch((e) => {
        if (e?.name === "AbortError") return;

        if (e instanceof ApiError && e.code === "NETWORK") {
          setConnectionError(true);
          return;
        }

        if (e instanceof ApiError && e.status === 401) {
          logout();
          setErrorText("Сессия истекла. Перезайдите.");
          return;
        }

        setErrorText(e?.message || "Ошибка");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [id, logout, token]);

  if (loading) return <p>Загрузка…</p>;
  if (connectionError) return <p className="error">Ошибка соединения</p>;
  if (errorText) {
    return (
      <div className="card col">
        <p className="error">{errorText}</p>
        <p>
          <Link to="/goods">← Back to list</Link>
        </p>
      </div>
    );
  }
  if (!item) return null;

  return (
    <div className="card col">
      <p className="muted">
        <Link to="/goods">← Back to list</Link>
      </p>

      <h2>{item.name}</h2>

      {/* обязательные поля по ТЗ */}
      <p>
        <b>Дата выпуска:</b> {item.releaseDate}
      </p>
      <p>
        <b>Цена:</b> €{item.price}
      </p>

      {item.description && <p className="muted">{item.description}</p>}
    </div>
  );
}

