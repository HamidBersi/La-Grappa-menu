import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/require-owner";

type ReorderBody = {
  categoryId?: string;
  orderedIds?: string[];
};

/** Réordonne les plats d’une catégorie (position = index dans orderedIds). */
export async function PATCH(request: Request) {
  const denied = await requireOwner();
  if (denied) return denied;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide." }, { status: 400 });
  }

  const input = body as ReorderBody;
  const categoryId = input.categoryId?.trim() ?? "";
  const orderedIds = Array.isArray(input.orderedIds)
    ? input.orderedIds.filter(
        (id): id is string => typeof id === "string" && id.length > 0,
      )
    : [];

  if (!categoryId) {
    return NextResponse.json({ error: "categoryId obligatoire." }, { status: 400 });
  }
  if (orderedIds.length === 0) {
    return NextResponse.json({ error: "orderedIds obligatoire." }, { status: 400 });
  }

  const category = await prisma.menuCategory.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });
  if (!category) {
    return NextResponse.json({ error: "Catégorie introuvable." }, { status: 404 });
  }

  const items = await prisma.menuItem.findMany({
    where: { categoryId, isAvailable: true },
    select: { id: true },
  });
  const existingIds = new Set(items.map((item) => item.id));

  if (orderedIds.length !== existingIds.size) {
    return NextResponse.json(
      { error: "La liste ne correspond pas aux plats de la catégorie." },
      { status: 400 },
    );
  }
  for (const id of orderedIds) {
    if (!existingIds.has(id)) {
      return NextResponse.json(
        { error: "Un plat n’appartient pas à cette catégorie." },
        { status: 400 },
      );
    }
  }

  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.menuItem.update({
        where: { id },
        data: { position: index },
      }),
    ),
  );

  return NextResponse.json({ ok: true });
}
