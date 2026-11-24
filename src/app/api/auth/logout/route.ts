import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { clearAuthCookie, COOKIE_NAME } from "@/lib/auth";
import { deleteSessionByToken } from "@/lib/store";

export async function POST() {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (token) {
    try {
      await deleteSessionByToken(token);
    } catch {
      // Выход в браузере важнее, чем строка сессии в базе.
    }
  }
  await clearAuthCookie();
  return NextResponse.json({ ok: true });
}
