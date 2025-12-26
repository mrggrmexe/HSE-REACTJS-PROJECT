import React from "react";
import { useAuth } from "../auth/AuthContext.jsx";

export default function HomePage() {
  const { isAuthed } = useAuth();

  return (
    <div className="card col">
      <h1>Fruit Shop (SPA prototype)</h1>
      <p className="muted">
        Вариант: <b>Фрукты</b>. Есть авторизация, защищённые маршруты, пагинация, карточка товара.
      </p>
      <p>
        Статус: {isAuthed ? <b>авторизован</b> : <b>не авторизован</b>}
      </p>
    </div>
  );
}

