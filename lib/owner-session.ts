import { createHmac, timingSafeEqual } from "crypto";
import { secretsMatch } from "@/lib/pin";

export const OWNER_SESSION_COOKIE = "grappa-owner-session";
const SESSION_PAYLOAD = "la-grappa-owner-v1";

export function isValidOwnerPin(pin: string): boolean {
  const expected = process.env.OWNER_PIN;
  if (!expected) return false;
  return secretsMatch(pin, expected);
}

export function createOwnerSessionToken(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return createHmac("sha256", secret).update(SESSION_PAYLOAD).digest("hex");
}

export function isValidOwnerSessionToken(token: string | undefined): boolean {
  if (!token || !process.env.SESSION_SECRET) return false;
  try {
    const expected = createOwnerSessionToken();
    const provided = Buffer.from(token);
    const reference = Buffer.from(expected);
    if (provided.length !== reference.length) return false;
    return timingSafeEqual(provided, reference);
  } catch {
    return false;
  }
}

export function getOwnerSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 12,
  };
}
