import { NextResponse } from "next/server";
import { createToken, hashPassword, setAuthCookie } from "@/lib/auth";
import { buildFullName } from "@/lib/types";
import { createUser, findUserByEmail, toPublicUser } from "@/lib/store";
import { registerSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Ошибка валидации" },
        { status: 400 },
      );
    }

    const { email, password, lastName, firstName, middleName } = parsed.data;
    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "Пользователь с таким email уже зарегистрирован" },
        { status: 409 },
      );
    }

    const passwordHash = await hashPassword(password);
    const user = await createUser({
      email,
      passwordHash,
      lastName,
      firstName,
      middleName,
    });
    const token = await createToken({
      sub: user.id,
      email: user.email,
      fullName: buildFullName(user),
    });
    await setAuthCookie(token);

    return NextResponse.json({ user: toPublicUser(user) }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Не удалось зарегистрироваться" }, { status: 500 });
  }
}
