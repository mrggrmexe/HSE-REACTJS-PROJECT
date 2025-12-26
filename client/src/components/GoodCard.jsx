import React from "react";
import { Link } from "react-router-dom";
import { fruitImages } from "../assets/fruits/index.js";

function pickFruitKey(name) {
  return String(name || "").trim().split(/\s+/)[0]; // "Apple #12" -> "Apple"
}

// пастельные RGB (без альфы). Альфа задаётся в CSS.
const PASTEL_TINT_RGB = {
  Apple: "255 183 197",
  Banana: "255 242 178",
  Peach: "255 214 165",
  Orange: "255 209 164",
  Grapes: "214 199 255",
  Mango: "255 225 163",
  Kiwi: "199 244 209",
  Pineapple: "255 244 176",
  Pear: "210 245 204",
};

export default function GoodCard({ good }) {
  const key = pickFruitKey(good?.name);
  const imgSrc = fruitImages[key];

  const tintRgb = PASTEL_TINT_RGB[key];
  const tinted = Boolean(tintRgb);

  return (
    <article
      className={`card goodCard ${tinted ? "goodCard--tinted" : ""}`}
      style={tinted ? { "--tint-rgb": tintRgb } : undefined}
    >
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
