import { NextResponse } from "next/server";
import { createToken, setAuthCookie, verifyPassword } from "@/lib/auth";
import { findUserByEmail, toPublicUser } from "@/lib/store";
import { loginSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Ошибка валидации" },
        { status: 400 },
      );
    }

    const { email, password } = parsed.data;
    const user = await findUserByEmail(email);
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return NextResponse.json({ error: "Неверный email или пароль" }, { status: 401 });
    }

    const token = await createToken({
      sub: user.id,
      email: user.email,
      fullName: user.fullName,
    });
    await setAuthCookie(token);

    return NextResponse.json({ user: toPublicUser(user) });
  } catch {
    return NextResponse.json({ error: "Не удалось выполнить вход" }, { status: 500 });
  }
}
