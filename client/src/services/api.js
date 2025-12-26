// client/src/services/api.js

export class ApiError extends Error {
  constructor(message, { status = 0, code = "UNKNOWN", data = null } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status; // HTTP status, либо 0 при сетевой ошибке
    this.code = code;     // "NETWORK" | "HTTP" | "UNKNOWN"
    this.data = data;     // тело ответа сервера (если получилось прочитать)
  }
}

async function safeReadJson(res) {
  const text = await res.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    // если сервер вернул не-JSON
    return { raw: text };
  }
}

/**
 * Универсальный запрос к API.
 * - NETWORK ошибки -> ApiError("Ошибка соединения", { code:"NETWORK" })
 * - HTTP ошибки (res.ok === false) -> ApiError(..., { code:"HTTP", status })
 */
export async function apiRequest(
  path,
  { method = "GET", body, token, signal } = {}
) {
  const headers = {
    Accept: "application/json"
  };

  let payloadBody;

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payloadBody = JSON.stringify(body);
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(path, { method, headers, body: payloadBody, signal });
  } catch {
    throw new ApiError("Ошибка соединения", { code: "NETWORK", status: 0 });
  }

  const data = await safeReadJson(res);

  if (!res.ok) {
    throw new ApiError(data?.message || `HTTP ${res.status}`, {
      code: "HTTP",
      status: res.status,
      data
    });
  }

  return data;
}
