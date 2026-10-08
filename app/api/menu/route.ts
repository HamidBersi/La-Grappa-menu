import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.menuCategory.findMany({
    where: { menuType: "plats" },
    orderBy: { position: "asc" },
    include: {
      items: {
        where: { isAvailable: true },
        orderBy: { position: "asc" },
      },
    },
  });

  return NextResponse.json(categories, {
    headers: { "Cache-Control": "no-store" },
  });
}