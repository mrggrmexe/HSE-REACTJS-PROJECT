import React from "react";
import { Link } from "react-router-dom";
import { fruitImages } from "../assets/fruits";

function pickFruitKey(name) {
  // Если name типа "Apple #12" — берём первое слово
  return String(name).split(" ")[0];
}

export default function GoodCard({ good }) {
  const key = pickFruitKey(good.name);
  const imgSrc = fruitImages[key];

  return (
    <article className="card goodCard">
      <div className="goodCard__media">
        {imgSrc ? (
          <img className="goodCard__img" src={imgSrc} alt={key} />
        ) : (
          <div className="goodCard__imgPlaceholder" />
        )}
      </div>

      <div className="goodCard__header">
        <h3 className="goodCard__title">{good.name}</h3>
        <div className="goodCard__meta">Дата: {good.releaseDate}</div>
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
