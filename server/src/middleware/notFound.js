import { notFound as nf } from "../utils/httpError.js";

export function notFound() {
  return (req, _res, next) => {
    next(nf(`Route not found: ${req.method} ${req.originalUrl}`));
  };
}

