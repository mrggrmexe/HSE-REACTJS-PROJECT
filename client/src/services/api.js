export class ApiError extends Error {
  constructor(message, { status = 0, code = "UNKNOWN", data = null } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status; // HTTP code, либо 0 для network error
    this.code = code;     // "NETWORK" | "HTTP" | ...
    this.data = data;     // ответ сервера (если есть)
  }
}

async function safeReadJson(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

export async function apiRequest(path, { method = "GET", body, token, signal } = {}) {
  const headers = {
    Accept: "application/json"
  };

  let payloadBody = undefined;

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
  } catch (e) {
    // fetch бросает ошибку при проблемах сети/соединения
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
export class ApiError extends Error {
  constructor(message, { status = 0, code = "UNKNOWN", data = null } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status; // HTTP code, либо 0 для network error
    this.code = code;     // "NETWORK" | "HTTP" | ...
    this.data = data;     // ответ сервера (если есть)
  }
}

async function safeReadJson(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

export async function apiRequest(path, { method = "GET", body, token, signal } = {}) {
  const headers = {
    Accept: "application/json"
  };

  let payloadBody = undefined;

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
  } catch (e) {
    // fetch бросает ошибку при проблемах сети/соединения
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
