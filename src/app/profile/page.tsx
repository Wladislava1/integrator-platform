import { AppShell } from "@/components/AppShell";
import { ProfileForm } from "@/components/ProfileForm";
import { getCurrentUser } from "@/lib/auth";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  return (
    <AppShell>
      <section className="mx-auto max-w-lg space-y-6">
        <div>
          <h1 className="font-display text-3xl font-semibold">Профиль</h1>
          <p className="mt-2 text-[var(--muted)]">
            Данные физического лица в СвязID
          </p>
        </div>
        {user ? <ProfileForm user={user} /> : null}
      </section>
    </AppShell>
  );
}
