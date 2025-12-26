import { HttpError } from "../utils/httpError.js";

// В Express error-handler должен иметь 4 аргумента (err, req, res, next). :contentReference[oaicite:3]{index=3}
export function errorHandler() {
  // eslint-disable-next-line no-unused-vars
  return (err, req, res, next) => {
    const isHttp = err instanceof HttpError;
    const status = isHttp ? err.status : 500;

    // логируем всегда; в prod не светим детали клиенту
    req.log?.error?.({ err, requestId: req.id }, "request error");

    const payload =
      status >= 500
        ? { message: "Internal Server Error", requestId: req.id }
        : { message: err.message, details: err.details, requestId: req.id };

    res.status(status).json(payload);
  };
}

