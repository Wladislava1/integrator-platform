import { AppShell } from "@/components/AppShell";
import { ThemeSettings } from "@/components/ThemeSettings";
import { getCurrentUser } from "@/lib/auth";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  return (
    <AppShell>
      <section className="mx-auto max-w-lg space-y-6">
        <div>
          <h1 className="font-display text-3xl font-semibold">Настройки</h1>
          <p className="mt-2 text-[var(--muted)]">Тема оформления интерфейса</p>
        </div>
        {user ? <ThemeSettings initialTheme={user.theme} /> : null}
      </section>
    </AppShell>
  );
}
