import React, { useMemo, useState } from "react";
import { apiRequest, ApiError } from "../services/api.js";
import { useAuth } from "../auth/AuthContext.jsx";

function validate({ name, email, subject, message }) {
  const errors = {};

  if (!name.trim()) errors.name = "Введите имя.";
  if (!email.trim()) errors.email = "Введите email.";
  if (email.trim() && !/^\S+@\S+\.\S+$/.test(email.trim())) errors.email = "Некорректный email.";
  if (!subject.trim()) errors.subject = "Введите тему обращения.";
  if (!message.trim()) errors.message = "Опишите проблему.";

  return errors;
}

export default function SupportPage() {
  const { token } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [statusText, setStatusText] = useState("");

  const refs = useMemo(
    () => ({ name: null, email: null, subject: null, message: null }),
    []
  );

  function onChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: undefined }));
    setStatus("idle");
    setStatusText("");
  }

  function focusFirstError(nextErrors) {
    const order = ["name", "email", "subject", "message"];
    const first = order.find((k) => nextErrors[k]);
    if (first && refs[first]) refs[first].focus();
  }

  async function onSubmit(e) {
    e.preventDefault();

    const nextErrors = validate(form);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatus("error");
      setStatusText("Проверьте поля формы.");
      focusFirstError(nextErrors);
      return;
    }

    setStatus("sending");
    setStatusText("");

    try {
      const res = await apiRequest("/api/support", {
        method: "POST",
        token,
        body: {
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject.trim(),
          message: form.message.trim(),
        },
      });

      setStatus("sent");
      setStatusText(res?.ticketId ? `Заявка отправлена. Номер: ${res.ticketId}` : "Заявка отправлена.");
      setForm({ name: "", email: "", subject: "", message: "" });
      setErrors({});
    } catch (err) {
      if (err instanceof ApiError && err.code === "NETWORK") {
        setStatus("error");
        setStatusText("Ошибка соединения");
        return;
      }
      setStatus("error");
      setStatusText(err?.message || "Ошибка отправки");
    }
  }

  return (
    <div className="col" style={{ gap: 12 }}>
      <div className="card">
        <h2>Support</h2>
        <p className="muted">Частые проблемы и форма для обращения в техподдержку.</p>
      </div>

      <div className="supportGrid">
        <section className="card">
          <h3>Частые проблемы</h3>

          <div className="faq">
            <details className="faqItem">
              <summary>Не могу войти в систему</summary>
              <p className="muted">
                Проверьте логин и пароль. Если сервер ругается на JWT_SECRET, задайте JWT_SECRET в server/.env и
                перезапустите сервер.
              </p>
            </details>

            <details className="faqItem">
              <summary>Вижу «Ошибка соединения»</summary>
              <p className="muted">
                Проверьте, что сервер запущен и доступен. В dev-режиме убедитесь, что запросы /api уходят на сервер.
              </p>
            </details>

            <details className="faqItem">
              <summary>Не работает пагинация</summary>
              <p className="muted">
                Эндпоинт /api/goods должен поддерживать параметры page и limit. Также проверьте, что вы авторизованы.
              </p>
            </details>

            <details className="faqItem">
              <summary>Не открывается карточка товара</summary>
              <p className="muted">
                Проверьте маршрут /goods/:id и серверный эндпоинт /api/goods/:id.
              </p>
            </details>

            <details className="faqItem">
              <summary>Картинки фруктов не отображаются</summary>
              <p className="muted">
                Проверьте импорты в client/src/assets/fruits/index.js. Имена файлов и расширения должны совпадать точно.
              </p>
            </details>
          </div>
        </section>

        <section className="card">
          <h3>Отправить обращение</h3>

          <form className="col supportForm" onSubmit={onSubmit} noValidate>
            <label className="col">
              <span className="muted">Имя</span>
              <input
                ref={(el) => (refs.name = el)}
                name="name"
                value={form.name}
                onChange={onChange}
                required
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "err_name" : undefined}
              />
              {errors.name ? (
                <span id="err_name" className="fieldError">
                  {errors.name}
                </span>
              ) : null}
            </label>

            <label className="col">
              <span className="muted">Email</span>
              <input
                ref={(el) => (refs.email = el)}
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                required
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "err_email" : undefined}
              />
              {errors.email ? (
                <span id="err_email" className="fieldError">
                  {errors.email}
                </span>
              ) : null}
            </label>

            <label className="col">
              <span className="muted">Тема</span>
              <input
                ref={(el) => (refs.subject = el)}
                name="subject"
                value={form.subject}
                onChange={onChange}
                required
                aria-invalid={Boolean(errors.subject)}
                aria-describedby={errors.subject ? "err_subject" : undefined}
              />
              {errors.subject ? (
                <span id="err_subject" className="fieldError">
                  {errors.subject}
                </span>
              ) : null}
            </label>

            <label className="col">
              <span className="muted">Сообщение</span>
              <textarea
                ref={(el) => (refs.message = el)}
                name="message"
                value={form.message}
                onChange={onChange}
                required
                rows={6}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? "err_message" : undefined}
              />
              {errors.message ? (
                <span id="err_message" className="fieldError">
                  {errors.message}
                </span>
              ) : null}
            </label>

            <button type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Отправка..." : "Отправить"}
            </button>

            {statusText ? (
              <p className={status === "error" ? "error" : "muted"} aria-live="polite">
                {statusText}
              </p>
            ) : null}
          </form>
        </section>
      </div>
    </div>
  );
}
