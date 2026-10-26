"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IoPower } from "react-icons/io5";
import { Logo } from "./Logo";
import { HeaderThemeMenu } from "./HeaderThemeMenu";

const links = [
  { href: "/catalog", label: "Каталог" },
  { href: "/profile", label: "Профиль" },
];

function initials(fullName: string) {
  return fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("") || "?";
}

export function AppHeader({ fullName }: { fullName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const avatar = initials(fullName);

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
          <Link
            href="/profile"
            title="Профиль"
            aria-label="Профиль"
            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white transition hover:opacity-90"
            style={{ background: "linear-gradient(145deg, var(--brand), var(--brand-strong))" }}
          >
            {avatar}
          </Link>
          <button
            type="button"
            onClick={logout}
            title="выйти"
            aria-label="выйти"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ffd6d6] text-[#e53935] transition hover:bg-[#ffc4c4]"
          >
            <IoPower size={22} aria-hidden />
          </button>
        </div>
      </div>
    </header>
  );
}
