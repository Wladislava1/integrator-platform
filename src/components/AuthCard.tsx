import type { ReactNode } from "react";
import { Logo } from "./Logo";

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 auth-bg">
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[0_20px_60px_-30px_rgba(16,84,52,0.45)]">
        <div className="mb-8">
          <Logo />
          <h1 className="mt-6 font-display text-2xl font-semibold text-[var(--foreground)]">
            {title}
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">{subtitle}</p>
        </div>
        {children}
        <div className="mt-6 text-center text-sm text-[var(--muted)]">{footer}</div>
      </div>
    </div>
  );
}
