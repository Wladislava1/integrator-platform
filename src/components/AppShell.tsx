import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AppHeader } from "./AppHeader";
import { ThemeProvider } from "./ThemeProvider";
import { getCurrentUser } from "@/lib/auth";

export async function AppShell({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <ThemeProvider initialTheme={user.theme}>
      <div className="min-h-screen">
        <AppHeader fullName={user.fullName} />
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      </div>
    </ThemeProvider>
  );
}
