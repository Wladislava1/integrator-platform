"use client";

import { FormEvent, useState } from "react";

const PRODUCT_NAME = "Потеряшки";
const SLOTS = Array.from({ length: 5 }, (_, index) => index + 1);

type Step = "closed" | "choice" | "credentials";

export function ProductCatalog() {
  const [step, setStep] = useState<Step>("closed");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pendingUrl, setPendingUrl] = useState("");

  function close() {
    setStep("closed");
    setError("");
    setEmail("");
    setPassword("");
    setPendingUrl("");
    setLoading(false);
  }

  function openProduct(tab: Window | null, url: string) {
    if (tab && !tab.closed) {
      tab.location.href = url;
      close();
      return;
    }
    setPendingUrl(url);
    setError("Браузер не открыл вкладку сам. Нажмите «Перейти в Потеряшки».");
  }

  async function readJson(response: Response) {
    return (await response.json().catch(() => ({}))) as { redirectUrl?: string; error?: string; found?: boolean };
  }

  async function onOpen() {
    const tab = window.open("about:blank", "_blank");
    setLoading(true);
    setError("");
    setPendingUrl("");
    try {
      const response = await fetch("/api/products/poteryashki/lookup", { method: "POST" });
      const data = await readJson(response);
      if (!response.ok) {
        tab?.close();
        setError(data.error ?? "Не удалось проверить пользователя в Потеряшках");
        return;
      }
      if (data.redirectUrl) {
        openProduct(tab, data.redirectUrl);
        return;
      }
      tab?.close();
      setStep("choice");
    } catch {
      tab?.close();
      setError("Не удалось связаться с Потеряшками");
    } finally {
      setLoading(false);
    }
  }

  async function onNoAccount() {
    const tab = window.open("about:blank", "_blank");
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/products/poteryashki/register", { method: "POST" });
      const data = await readJson(response);
      if (!response.ok || !data.redirectUrl) {
        tab?.close();
        setError(data.error ?? "Не удалось создать аккаунт в Потеряшках");
        return;
      }
      openProduct(tab, data.redirectUrl);
    } catch {
      tab?.close();
      setError("Не удалось связаться с Потеряшками");
    } finally {
      setLoading(false);
    }
  }

  async function onCredentials(event: FormEvent) {
    event.preventDefault();
    const tab = window.open("about:blank", "_blank");
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/products/poteryashki/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await readJson(response);
      if (!response.ok || !data.redirectUrl) {
        tab?.close();
        setError(data.error ?? "Неверный email или пароль в Потеряшках");
        return;
      }
      openProduct(tab, data.redirectUrl);
    } catch {
      tab?.close();
      setError("Не удалось связаться с Потеряшками");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Каталог продуктов</h1>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <article className="lk-card flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <span
              className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl"
              style={{ background: "var(--brand-soft)", color: "var(--brand-strong)" }}
              aria-hidden
            >
              <PawIcon />
            </span>
            <div>
              <h2 className="text-lg font-semibold leading-tight">{PRODUCT_NAME}</h2>
              <p className="mt-1 text-sm leading-snug" style={{ color: "var(--muted)" }}>
                Объявления о потерянных и найденных животных
              </p>
            </div>
          </div>
          <button type="button" className="btn-primary w-full" onClick={() => void onOpen()} disabled={loading}>
            {loading && step === "closed" ? "Проверяем…" : "Открыть"}
          </button>
          {pendingUrl && step === "closed" ? (
            <a className="btn-primary w-full text-center" href={pendingUrl} target="_blank" rel="noopener noreferrer">
              Перейти в Потеряшки
            </a>
          ) : null}
          {error && step === "closed" ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
        </article>

        {SLOTS.map((slot) => (
          <div key={slot} className="product-slot" aria-label={`Слот продукта ${slot}`}>
            Место для продукта
          </div>
        ))}
      </div>

      {step !== "closed" ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4" role="presentation">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-dialog-title"
            className="lk-card relative w-full max-w-md"
          >
            <button
              type="button"
              className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full"
              style={{ color: "var(--brand-strong)" }}
              onClick={close}
              aria-label="Закрыть"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
            <h2 id="product-dialog-title" className="mb-4 pr-8 text-lg font-semibold leading-snug">
              {step === "choice"
                ? `У вас уже есть аккаунт в «${PRODUCT_NAME}»?`
                : "Введите данные от вашего аккаунта"}
            </h2>

            {step === "choice" ? (
              <div className="flex gap-3">
                <button type="button" className="btn-primary flex-1" disabled={loading} onClick={() => { setError(""); setStep("credentials"); }}>
                  Да
                </button>
                <button type="button" className="btn-primary flex-1" disabled={loading} onClick={() => void onNoAccount()}>
                  {loading ? "Открываем…" : "Нет"}
                </button>
              </div>
            ) : (
              <form className="space-y-3" onSubmit={(event) => void onCredentials(event)}>
                <label className="block space-y-1">
                  <span className="field-label">Почта</span>
                  <input
                    className="input-field"
                    type="email"
                    autoComplete="username"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </label>
                <label className="block space-y-1">
                  <span className="field-label">Пароль</span>
                  <input
                    className="input-field"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </label>
                <button type="submit" className="btn-primary w-full" disabled={loading}>
                  {loading ? "Проверяем…" : "Войти в продукт"}
                </button>
              </form>
            )}

            {pendingUrl ? (
              <a className="btn-primary mt-3 w-full" href={pendingUrl} target="_blank" rel="noopener noreferrer">
                Перейти в Потеряшки
              </a>
            ) : null}
            {error ? <p className="mt-3 text-sm text-[var(--danger)]">{error}</p> : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function PawIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
      <ellipse cx="8" cy="10" rx="3.2" ry="4" />
      <ellipse cx="16" cy="7" rx="3.2" ry="4" />
      <ellipse cx="24" cy="10" rx="3.2" ry="4" />
      <ellipse cx="11" cy="16" rx="2.4" ry="3" />
      <path d="M16 15c3.8 0 7 2.6 7 6.2 0 3.2-2.6 5.8-7 5.8s-7-2.6-7-5.8C9 17.6 12.2 15 16 15z" />
    </svg>
  );
}
