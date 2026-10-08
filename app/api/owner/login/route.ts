import { NextResponse } from "next/server";
import { clientIp } from "@/lib/pin";
import { registerFailedAttempt } from "@/lib/rate-limit";
import {
  OWNER_SESSION_COOKIE,
  createOwnerSessionToken,
  getOwnerSessionCookieOptions,
  isValidOwnerPin,
} from "@/lib/owner-session";

export async function POST(request: Request) {
  const ip = clientIp(request);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide." }, { status: 400 });
  }

  const pin =
    typeof body === "object" &&
    body !== null &&
    "pin" in body &&
    typeof (body as { pin: unknown }).pin === "string"
      ? (body as { pin: string }).pin.trim()
      : "";

  if (!isValidOwnerPin(pin)) {
    const blocked = registerFailedAttempt(`login:${ip}`);
    if (blocked) {
      return NextResponse.json(
        { error: "Trop d’essais. Réessaie plus tard." },
        { status: 429 },
      );
    }
    return NextResponse.json({ error: "Code incorrect." }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(
    OWNER_SESSION_COOKIE,
    createOwnerSessionToken(),
    getOwnerSessionCookieOptions(),
  );
  return response;
}
