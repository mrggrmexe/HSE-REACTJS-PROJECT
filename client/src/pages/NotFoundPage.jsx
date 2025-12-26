import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="card col">
      <h2>404</h2>
      <p>Страница не найдена.</p>
      <p>
        <Link to="/">Go Home</Link>
      </p>
    </div>
  );
}
