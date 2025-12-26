export class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.details = details;
  }
}

export function badRequest(message = "Bad Request", details) {
  return new HttpError(400, message, details);
}

export function unauthorized(message = "Unauthorized", details) {
  return new HttpError(401, message, details);
}

export function notFound(message = "Not Found", details) {
  return new HttpError(404, message, details);
}

