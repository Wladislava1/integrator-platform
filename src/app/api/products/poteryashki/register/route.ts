import { NextResponse } from "next/server";
import { currentUserOr401, handoffError, redirectBody } from "@/lib/productHandoff";
import { openLostPets, profileFromUser } from "@/lib/lostPets";
import { saveProductLink } from "@/lib/store";

export async function POST() {
  try {
    const auth = await currentUserOr401();
    if ("error" in auth) return auth.error;

    const code = await openLostPets(profileFromUser(auth.user), true);
    if (!code) {
      return NextResponse.json({ error: "Не удалось открыть Потеряшки" }, { status: 502 });
    }
    await saveProductLink(auth.user.id, auth.user.email);
    return redirectBody(code);
  } catch (error) {
    return handoffError(error);
  }
}
