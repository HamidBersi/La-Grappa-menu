import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { requireOwner } from "@/lib/require-owner";

function allowedMenuUrl(candidate: string, origin: string): boolean {
  try {
    const parsed = new URL(candidate);
    if (parsed.origin !== origin) return false;
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false;
    return parsed.pathname === "/menu" || parsed.pathname.startsWith("/menu/");
  } catch {
    return false;
  }
}

/** QR vers le menu public (même origine uniquement). */
export async function GET(request: Request) {
  const denied = await requireOwner();
  if (denied) return denied;

  const requestUrl = new URL(request.url);
  const customUrl = requestUrl.searchParams.get("url")?.trim();
  const menuUrl = customUrl || `${requestUrl.origin}/menu`;

  if (!allowedMenuUrl(menuUrl, requestUrl.origin)) {
    return NextResponse.json({ error: "URL non autorisée." }, { status: 400 });
  }

  try {
    const png = await QRCode.toBuffer(menuUrl, {
      type: "png",
      width: 512,
      margin: 2,
      color: {
        dark: "#1E3A2F",
        light: "#FFFFFF",
      },
    });

    return new NextResponse(new Uint8Array(png), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("QR generation failed:", error);
    return NextResponse.json(
      { error: "Impossible de générer le QR code." },
      { status: 500 },
    );
  }
}
