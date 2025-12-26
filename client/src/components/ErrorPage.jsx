import React from "react";
import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const err = useRouteError();

  let title = "Something went wrong";
  let message = "Unknown error";

  if (isRouteErrorResponse(err)) {
    title = `Route error ${err.status}`;
    message = err.statusText || String(err.data || "");
  } else if (err instanceof Error) {
    message = err.message;
  } else if (typeof err === "string") {
    message = err;
  }

  return (
    <div className="card">
      <h2>{title}</h2>
      <p className="error">{message}</p>
      <p>
        <Link to="/">Go Home</Link>
      </p>
    </div>
  );
}
