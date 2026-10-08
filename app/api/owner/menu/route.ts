import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/require-owner";

export async function GET() {
  const denied = await requireOwner();
  if (denied) return denied;

  const categories = await prisma.menuCategory.findMany({
    where: { menuType: "plats" },
    orderBy: { position: "asc" },
    include: {
      items: { orderBy: { position: "asc" } },
    },
  });

  return NextResponse.json(categories, {
    headers: { "Cache-Control": "no-store" },
  });
}
