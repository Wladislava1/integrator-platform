import { NextResponse } from "next/server";
import { getCurrentUser, hashPassword, verifyPassword } from "@/lib/auth";
import { findUserById, updateUser } from "@/lib/store";
import { passwordChangeSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const current = await getCurrentUser();
  if (!current) {
    return NextResponse.json({ error: "Требуется вход" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = passwordChangeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Ошибка валидации" },
        { status: 400 },
      );
    }

    const user = await findUserById(current.id);
    if (!user) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
    }

    const ok = await verifyPassword(parsed.data.currentPassword, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: "Неверный текущий пароль" }, { status: 400 });
    }

    const passwordHash = await hashPassword(parsed.data.newPassword);
    await updateUser(user.id, { passwordHash });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Не удалось сменить пароль" }, { status: 500 });
  }
}
