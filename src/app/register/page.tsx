"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AuthCard } from "@/components/AuthCard";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password, confirmPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Ошибка регистрации");
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
      title="Регистрация"
      subtitle="Создайте учётную запись физического лица в СвязID"
      footer={
        <>
          Уже есть аккаунт?{" "}
          <Link href="/login" className="text-[var(--brand-strong)] font-medium hover:underline">
            Войти
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <label className="block space-y-1.5">
          <span className="text-sm text-[var(--muted)]">ФИО</span>
          <input
            className="input-field"
            type="text"
            autoComplete="name"
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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm text-[var(--muted)]">Повтор пароля</span>
          <input
            className="input-field"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Создаём…" : "Зарегистрироваться"}
        </button>
      </form>
    </AuthCard>
  );
}
