import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireOwner } from "@/lib/require-owner";
import {
  SEARCH_MAX_RESULTS,
  SEARCH_MIN_QUERY_LENGTH,
  matchesDishName,
} from "@/lib/dish-search";

export async function GET(request: Request) {
  const denied = await requireOwner();
  if (denied) return denied;

  const params = new URL(request.url).searchParams;
  const query = params.get("q")?.trim() ?? "";
  const categoryId = params.get("categoryId")?.trim() ?? "";

  if (query.length < SEARCH_MIN_QUERY_LENGTH || !categoryId) {
    return NextResponse.json([]);
  }

  const category = await prisma.menuCategory.findUnique({
    where: { id: categoryId },
    select: { menuType: true },
  });
  if (!category) {
    return NextResponse.json([]);
  }

  const items = await prisma.menuItem.findMany({
    where: {
      isAvailable: false,
      category: { menuType: category.menuType },
    },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      priceVerre: true,
      priceQuart: true,
      priceDemi: true,
      priceBouteille: true,
      emoji: true,
      category: { select: { name: true } },
    },
    orderBy: { name: "asc" },
  });

  const results = items
    .filter((item) => matchesDishName(item.name, query))
    .slice(0, SEARCH_MAX_RESULTS)
    .map(({ category: itemCategory, ...item }) => ({
      ...item,
      categoryName: itemCategory.name,
    }));

  return NextResponse.json(results);
}
