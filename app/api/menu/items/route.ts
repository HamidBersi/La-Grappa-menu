import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/require-owner";
import {
  headlineFromTiers,
  parseOptionalPrice,
  parseRequiredPrice,
} from "@/lib/menu-price";
import { normalizeDishEmoji } from "@/lib/dish-emoji";

const NAME_MAX = 120;
const DESCRIPTION_MAX = 500;

type CreateItemBody = {
  categoryId?: string;
  name?: string;
  description?: string;
  price?: string;
  priceVerre?: string;
  priceQuart?: string;
  priceDemi?: string;
  priceBouteille?: string;
  emoji?: string | null;
};

export async function POST(request: Request) {
  const denied = await requireOwner();
  if (denied) return denied;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide." }, { status: 400 });
  }

  const input = body as CreateItemBody;
  const categoryId = input.categoryId?.trim() ?? "";
  const name = input.name?.trim() ?? "";
  const description = input.description?.trim() || null;

  if (!categoryId || !name) {
    return NextResponse.json(
      { error: "Catégorie et nom sont obligatoires." },
      { status: 400 },
    );
  }
  if (name.length > NAME_MAX) {
    return NextResponse.json({ error: "Nom trop long." }, { status: 400 });
  }
  if (description && description.length > DESCRIPTION_MAX) {
    return NextResponse.json({ error: "Description trop longue." }, { status: 400 });
  }

  const verre = parseOptionalPrice(input.priceVerre);
  const quart = parseOptionalPrice(input.priceQuart);
  const demi = parseOptionalPrice(input.priceDemi);
  const bouteille = parseOptionalPrice(input.priceBouteille);
  if (!verre.ok || !quart.ok || !demi.ok || !bouteille.ok) {
    return NextResponse.json({ error: "Prix invalide." }, { status: 400 });
  }

  const hasWineTiers = Boolean(
    verre.value || quart.value || demi.value || bouteille.value,
  );

  let priceRaw = "";
  if (hasWineTiers) {
    priceRaw =
      headlineFromTiers({
        verre: verre.value,
        quart: quart.value,
        demi: demi.value,
        bouteille: bouteille.value,
      }) ?? "";
  } else {
    const parsedPrice = parseRequiredPrice(input.price);
    if (!parsedPrice.ok) {
      return NextResponse.json({ error: "Prix invalide." }, { status: 400 });
    }
    priceRaw = parsedPrice.value;
  }

  if (!priceRaw) {
    return NextResponse.json(
      { error: "Catégorie, nom et au moins un prix sont obligatoires." },
      { status: 400 },
    );
  }

  const category = await prisma.menuCategory.findUnique({
    where: { id: categoryId },
  });
  if (!category) {
    return NextResponse.json({ error: "Catégorie introuvable." }, { status: 404 });
  }

  const last = await prisma.menuItem.findFirst({
    where: { categoryId },
    orderBy: { position: "desc" },
    select: { position: true },
  });

  const item = await prisma.menuItem.create({
    data: {
      categoryId,
      name,
      description,
      price: priceRaw,
      position: (last?.position ?? -1) + 1,
      isAvailable: true,
      priceVerre: verre.value,
      priceQuart: quart.value,
      priceDemi: demi.value,
      priceBouteille: bouteille.value,
      emoji: normalizeDishEmoji(input.emoji),
    },
  });

  return NextResponse.json(item, { status: 201 });
}
