import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { toPublicUser, updateUser } from "@/lib/store";
import { themeSchema } from "@/lib/validation";

export async function PATCH(request: Request) {
  const current = await getCurrentUser();
  if (!current) {
    return NextResponse.json({ error: "Требуется вход" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = themeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Некорректная тема" }, { status: 400 });
    }

    const updated = await updateUser(current.id, { theme: parsed.data.theme });
    if (!updated) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
    }
    return NextResponse.json({ user: toPublicUser(updated) });
  } catch {
    return NextResponse.json({ error: "Не удалось сохранить тему" }, { status: 500 });
  }
}
