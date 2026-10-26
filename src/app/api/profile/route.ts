import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { toPublicUser, updateUser } from "@/lib/store";
import { profileSchema } from "@/lib/validation";
import { findUserById } from "@/lib/store";

export async function PATCH(request: Request) {
  const current = await getCurrentUser();
  if (!current) {
    return NextResponse.json({ error: "Требуется вход" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = profileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Ошибка валидации" },
        { status: 400 },
      );
    }

    const updated = await updateUser(current.id, parsed.data);
    if (!updated) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
    }
    return NextResponse.json({ user: toPublicUser(updated) });
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_TAKEN") {
      return NextResponse.json({ error: "Email уже занят" }, { status: 409 });
    }
    return NextResponse.json({ error: "Не удалось сохранить профиль" }, { status: 500 });
  }
}

export async function GET() {
  const current = await getCurrentUser();
  if (!current) {
    return NextResponse.json({ error: "Требуется вход" }, { status: 401 });
  }
  const user = await findUserById(current.id);
  if (!user) {
    return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
  }
  return NextResponse.json({ user: toPublicUser(user) });
}
