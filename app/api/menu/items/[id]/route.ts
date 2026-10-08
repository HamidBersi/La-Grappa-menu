import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/require-owner";
import {
  headlineFromTiers,
  parseOptionalPrice,
  parseRequiredPrice,
} from "@/lib/menu-price";

const NAME_MAX = 120;
const DESCRIPTION_MAX = 500;

type UpdateItemBody = {
  name?: string;
  description?: string | null;
  price?: string;
  isAvailable?: boolean;
  priceVerre?: string | null;
  priceQuart?: string | null;
  priceDemi?: string | null;
  priceBouteille?: string | null;
};

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const denied = await requireOwner();
  if (denied) return denied;

  const { id } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide." }, { status: 400 });
  }

  const input = body as UpdateItemBody;
  const data: {
    name?: string;
    description?: string | null;
    price?: string;
    isAvailable?: boolean;
    priceVerre?: string | null;
    priceQuart?: string | null;
    priceDemi?: string | null;
    priceBouteille?: string | null;
  } = {};

  if (typeof input.name === "string") {
    const name = input.name.trim();
    if (!name || name.length > NAME_MAX) {
      return NextResponse.json({ error: "Nom invalide." }, { status: 400 });
    }
    data.name = name;
  }

  if ("description" in input) {
    const description =
      typeof input.description === "string" ? input.description.trim() : "";
    if (description.length > DESCRIPTION_MAX) {
      return NextResponse.json({ error: "Description trop longue." }, { status: 400 });
    }
    data.description = description || null;
  }

  if (typeof input.price === "string") {
    const parsedPrice = parseRequiredPrice(input.price);
    if (!parsedPrice.ok) {
      return NextResponse.json({ error: "Prix invalide." }, { status: 400 });
    }
    data.price = parsedPrice.value;
  }

  const wineKeys = [
    "priceVerre",
    "priceQuart",
    "priceDemi",
    "priceBouteille",
  ] as const;
  const sentWine = wineKeys.filter((key) => key in input);
  if (sentWine.length > 0) {
    const verre = parseOptionalPrice(input.priceVerre);
    const quart = parseOptionalPrice(input.priceQuart);
    const demi = parseOptionalPrice(input.priceDemi);
    const bouteille = parseOptionalPrice(input.priceBouteille);
    if (!verre.ok || !quart.ok || !demi.ok || !bouteille.ok) {
      return NextResponse.json({ error: "Prix invalide." }, { status: 400 });
    }
    data.priceVerre = verre.value;
    data.priceQuart = quart.value;
    data.priceDemi = demi.value;
    data.priceBouteille = bouteille.value;
    const headline = headlineFromTiers({
      verre: verre.value,
      quart: quart.value,
      demi: demi.value,
      bouteille: bouteille.value,
    });
    if (headline) {
      data.price = headline;
    }
  }

  if (typeof input.isAvailable === "boolean") {
    data.isAvailable = input.isAvailable;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Rien à modifier." }, { status: 400 });
  }

  try {
    const item = await prisma.menuItem.update({
      where: { id },
      data,
    });
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Plat introuvable." }, { status: 404 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const denied = await requireOwner();
  if (denied) return denied;

  const { id } = await context.params;

  try {
    await prisma.menuItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Plat introuvable." }, { status: 404 });
  }
}
