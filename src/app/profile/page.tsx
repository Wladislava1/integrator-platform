import { AppShell } from "@/components/AppShell";
import { ProfilePage } from "@/components/ProfilePage";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProfileRoute() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <AppShell>
      <ProfilePage user={user} />
    </AppShell>
  );
}
