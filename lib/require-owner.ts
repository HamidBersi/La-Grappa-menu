import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  OWNER_SESSION_COOKIE,
  isValidOwnerSessionToken,
} from "@/lib/owner-session";

export async function requireOwner(): Promise<NextResponse | null> {
  if (!process.env.OWNER_PIN || !process.env.SESSION_SECRET) {
    return NextResponse.json(
      { error: "Configuration serveur manquante." },
      { status: 500 },
    );
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(OWNER_SESSION_COOKIE)?.value;

  if (!isValidOwnerSessionToken(token)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  return null;
}
