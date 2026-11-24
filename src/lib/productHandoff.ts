import { NextResponse } from "next/server";
import { getCurrentUser } from "./auth";
import { entryUrl, LostPetsError } from "./lostPets";
import type { PublicUser } from "./types";

export async function currentUserOr401(): Promise<
  { user: PublicUser } | { error: NextResponse }
> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: NextResponse.json({ error: "Требуется вход" }, { status: 401 }) };
  }
  return { user };
}

export function handoffError(error: unknown) {
  if (error instanceof LostPetsError) {
    const status = error.status >= 400 && error.status < 600 ? error.status : 502;
    return NextResponse.json({ error: error.message }, { status });
  }
  return NextResponse.json({ error: "Не удалось перейти в Потеряшки" }, { status: 500 });
}

export function redirectBody(code: string) {
  return NextResponse.json({ redirectUrl: entryUrl(code) });
}
