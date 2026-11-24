import { NextResponse } from "next/server";
import { currentUserOr401, handoffError, redirectBody } from "@/lib/productHandoff";
import { lookupLostPets, openLostPets, profileFromUser } from "@/lib/lostPets";
import { saveProductLink } from "@/lib/store";

export async function POST() {
  try {
    const auth = await currentUserOr401();
    if ("error" in auth) return auth.error;

    const profile = profileFromUser(auth.user);
    const match = await lookupLostPets(profile.email, profile.svyaz_id);
    if (!match.found) return NextResponse.json({ found: false });

    await saveProductLink(auth.user.id, match.email);
    const code = await openLostPets({ ...profile, email: match.email }, false);
    if (!code) return NextResponse.json({ found: false });
    return redirectBody(code);
  } catch (error) {
    return handoffError(error);
  }
}
