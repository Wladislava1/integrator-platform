import { NextResponse } from "next/server";
import { currentUserOr401, handoffError, redirectBody } from "@/lib/productHandoff";
import { linkLostPets } from "@/lib/lostPets";
import { saveProductLink } from "@/lib/store";
import { productLoginSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const auth = await currentUserOr401();
    if ("error" in auth) return auth.error;

    const body = await request.json().catch(() => null);
    const parsed = productLoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Проверьте почту и пароль" },
        { status: 400 },
      );
    }

    const code = await linkLostPets(parsed.data.email, parsed.data.password, auth.user.id);
    await saveProductLink(auth.user.id, parsed.data.email);
    return redirectBody(code);
  } catch (error) {
    return handoffError(error);
  }
}
