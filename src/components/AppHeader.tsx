"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "./Logo";
import { HeaderThemeMenu } from "./HeaderThemeMenu";

const links = [
  { href: "/catalog", label: "Каталог" },
  { href: "/profile", label: "Профиль" },
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
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur">
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
                    ? "bg-[var(--brand-soft)] font-medium text-[var(--brand-strong)]"
                    : "text-[var(--muted)] hover:bg-[var(--brand-soft)]/60 hover:text-[var(--foreground)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3" data-header-actions>
          <HeaderThemeMenu />
          <span className="hidden text-sm text-[var(--muted)] sm:inline">{fullName}</span>
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
