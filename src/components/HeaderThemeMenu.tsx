"use client";

import { useEffect, useId, useRef, useState } from "react";
import { IoIosColorPalette } from "react-icons/io";
import { FaCircleHalfStroke } from "react-icons/fa6";
import { IoMoonSharp, IoSunny } from "react-icons/io5";
import { useTheme } from "./ThemeProvider";
import type { Theme } from "@/lib/types";

const OPTIONS: Array<{
  id: Theme;
  title: string;
  caption: string;
  Icon: typeof IoSunny;
}> = [
  { id: "auto", title: "Авто", caption: "Системная", Icon: FaCircleHalfStroke },
  { id: "light", title: "Светлая", caption: "Дневная", Icon: IoSunny },
  { id: "dark", title: "Тёмная", caption: "Ночная", Icon: IoMoonSharp },
];

export function HeaderThemeMenu() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!(event.target instanceof Node)) return;
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function choose(next: Theme) {
    setTheme(next);
    setOpen(false);
    setSaving(true);
    try {
      await fetch("/api/settings/theme", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: next }),
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className={`flex h-10 w-11 items-center justify-center rounded-[10px] transition ${
          open
            ? "bg-[var(--brand)] text-white"
            : "bg-[var(--brand-soft)] text-[var(--muted)] hover:text-[var(--brand-strong)]"
        }`}
        aria-label="Тема оформления"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        title="Тема оформления"
        disabled={saving}
        onClick={() => setOpen((v) => !v)}
      >
        <IoIosColorPalette size={28} aria-hidden />
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] z-50 w-[172px] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-lg"
        >
          {OPTIONS.map((opt) => {
            const selected = theme === opt.id;
            const Icon = opt.Icon;
            return (
              <button
                key={opt.id}
                type="button"
                role="menuitemradio"
                aria-checked={selected}
                className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition ${
                  selected
                    ? "bg-[var(--brand-soft)] text-[var(--brand-strong)]"
                    : "text-[var(--foreground)] hover:bg-[var(--brand-soft)]/60"
                }`}
                onClick={() => choose(opt.id)}
              >
                <Icon size={16} className="shrink-0" aria-hidden />
                <span className="min-w-0 leading-tight">
                  <span className="block font-medium">{opt.title}</span>
                  <span className="block text-xs text-[var(--muted)]">{opt.caption}</span>
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
