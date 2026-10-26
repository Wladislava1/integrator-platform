"use client";

import { FormEvent, useMemo, useState } from "react";
import type { PublicUser } from "@/lib/types";

function initials(fullName: string) {
  return fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function ProfileForm({ user }: { user: PublicUser }) {
  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const avatarLetters = useMemo(() => initials(fullName || user.fullName), [fullName, user.fullName]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Ошибка сохранения");
        return;
      }
      setMessage("Профиль сохранён");
    } catch {
      setError("Сеть недоступна");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-5"
    >
      <div className="flex items-center gap-4">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full text-lg font-semibold text-white"
          style={{ background: "linear-gradient(145deg, var(--brand), var(--brand-strong))" }}
          aria-label="Аватар"
        >
          {avatarLetters || "?"}
        </div>
        <div>
          <div className="font-medium">{fullName || "Без имени"}</div>
          <div className="text-sm text-[var(--muted)]">{email}</div>
        </div>
      </div>

      <label className="block space-y-1.5">
        <span className="text-sm text-[var(--muted)]">ФИО</span>
        <input
          className="input-field"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </label>
      <label className="block space-y-1.5">
        <span className="text-sm text-[var(--muted)]">Email</span>
        <input
          className="input-field"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
      {message ? <p className="text-sm text-[var(--brand-strong)]">{message}</p> : null}

      <button className="btn-primary" type="submit" disabled={loading}>
        {loading ? "Сохраняем…" : "Сохранить"}
      </button>
    </form>
  );
}
