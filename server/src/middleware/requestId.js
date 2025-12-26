import crypto from "crypto";

export function requestId() {
  return (req, res, next) => {
    const existing = req.headers["x-request-id"];
    const id = typeof existing === "string" && existing.trim() ? existing : crypto.randomUUID();

    req.id = id;
    res.setHeader("x-request-id", id);
    next();
  };
}

