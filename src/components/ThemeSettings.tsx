"use client";

import { useState } from "react";
import { useTheme } from "./ThemeProvider";
import type { Theme } from "@/lib/types";

export function ThemeSettings({ initialTheme }: { initialTheme: Theme }) {
  const { theme, setTheme } = useTheme();
  const [current, setCurrent] = useState<Theme>(theme || initialTheme);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function choose(next: Theme) {
    setCurrent(next);
    setTheme(next);
    setMessage("");
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/settings/theme", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: next }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Не удалось сохранить тему");
        return;
      }
      setMessage(next === "dark" ? "Включена тёмная тема" : "Включена светлая тема");
    } catch {
      setError("Сеть недоступна");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
      <p className="text-sm text-[var(--muted)]">Выберите тему</p>
      <div className="grid grid-cols-2 gap-3">
        {(["light", "dark"] as Theme[]).map((value) => {
          const active = current === value;
          return (
            <button
              key={value}
              type="button"
              disabled={loading}
              onClick={() => choose(value)}
              className={`rounded-xl border px-4 py-4 text-left transition ${
                active
                  ? "border-[var(--brand)] bg-[var(--brand-soft)]"
                  : "border-[var(--border)] hover:bg-[var(--brand-soft)]/50"
              }`}
            >
              <div className="font-medium">
                {value === "light" ? "Светлая" : "Тёмная"}
              </div>
              <div className="mt-1 text-xs text-[var(--muted)]">
                {value === "light" ? "Зелёные оттенки на светлом фоне" : "Тёмный фон с акцентом связки"}
              </div>
            </button>
          );
        })}
      </div>
      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
      {message ? <p className="text-sm text-[var(--brand-strong)]">{message}</p> : null}
    </div>
  );
}
