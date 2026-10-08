import { NextResponse } from "next/server";
import { OWNER_SESSION_COOKIE } from "@/lib/owner-session";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(OWNER_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
