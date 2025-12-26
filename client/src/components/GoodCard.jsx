import React from "react";
import { Link } from "react-router-dom";

export default function GoodCard({ good }) {
  return (
    <article className="card goodCard">
      <div className="goodCard__header">
        <h3 className="goodCard__title">{good.name}</h3>
        <div className="goodCard__meta">
          <span className="muted">Дата: {good.releaseDate}</span>
        </div>
      </div>

      <div className="goodCard__footer">
        <div className="goodCard__price">€{good.price}</div>
        <Link className="goodCard__btn" to={`/goods/${good.id}`}>
          Подробнее
        </Link>
      </div>
    </article>
  );
}
