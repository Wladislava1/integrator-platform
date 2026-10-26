"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AuthCard } from "@/components/AuthCard";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Ошибка входа");
        return;
      }
      router.push("/catalog");
      router.refresh();
    } catch {
      setError("Сеть недоступна");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Вход"
      subtitle="Единый доступ СвязID к Integrator Platform"
      footer={
        <>
          Нет аккаунта?{" "}
          <Link href="/register" className="text-[var(--brand-strong)] font-medium hover:underline">
            Зарегистрироваться
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <label className="block space-y-1.5">
          <span className="text-sm text-[var(--muted)]">Email</span>
          <input
            className="input-field"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm text-[var(--muted)]">Пароль</span>
          <input
            className="input-field"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Входим…" : "Войти"}
        </button>
      </form>
    </AuthCard>
  );
}
