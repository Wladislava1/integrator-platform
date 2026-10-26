"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "./Logo";

const links = [
  { href: "/catalog", label: "Каталог" },
  { href: "/profile", label: "Профиль" },
  { href: "/settings", label: "Настройки" },
];

export function AppHeader({ fullName }: { fullName: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur sticky top-0 z-20">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Logo size="sm" />
        <nav className="flex items-center gap-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm transition ${
                  active
                    ? "bg-[var(--brand-soft)] text-[var(--brand-strong)] font-medium"
                    : "text-[var(--muted)] hover:bg-[var(--brand-soft)]/60 hover:text-[var(--foreground)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-sm text-[var(--muted)]">{fullName}</span>
          <button
            type="button"
            onClick={logout}
            className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--foreground)] hover:bg-[var(--brand-soft)]"
          >
            Выйти
          </button>
        </div>
      </div>
    </header>
  );
}
