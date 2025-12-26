import React, { useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { apiRequest, ApiError } from "../services/api.js";

export default function LoginPage() {
  const { isAuthed, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = useMemo(() => location.state?.from || "/goods", [location.state]);

  const [form, setForm] = useState({ login: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  const abortRef = useRef(null);

  if (isAuthed) {
    // уже залогинен — отправим сразу в goods
    navigate("/goods", { replace: true });
  }

  const onChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorText("");

    const loginStr = form.login.trim();
    const passStr = form.password.trim();

    if (!loginStr || !passStr) {
      setErrorText("Введите логин и пароль");
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    try {
      const data = await apiRequest("/api/login", {
        method: "POST",
        body: { login: loginStr, password: passStr },
        signal: controller.signal
      });

      login(data.token);
      navigate(from, { replace: true });
    } catch (e2) {
      if (e2?.name === "AbortError") return;

      if (e2 instanceof ApiError && e2.code === "NETWORK") {
        setErrorText("Ошибка соединения");
      } else {
        setErrorText(e2?.message || "Ошибка входа");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authPage">
      <div className="card col authCard">
        <h2>Login</h2>

        <form onSubmit={onSubmit} className="col">
          <label className="col">
            <span className="muted">Логин</span>
            <input name="login" value={form.login} onChange={onChange} autoComplete="username" />
          </label>

          <label className="col">
            <span className="muted">Пароль</span>
            <input
              name="password"
              value={form.password}
              onChange={onChange}
              type="password"
              autoComplete="current-password"
            />
          </label>

          {errorText && <p className="error">{errorText}</p>}

          <button disabled={loading} type="submit">
            {loading ? "Загрузка…" : "Войти"}
          </button>

          <p className="muted">
            Для демо подойдёт любой непустой логин/пароль.
          </p>
        </form>
      </div>
    </div>
  );
}

