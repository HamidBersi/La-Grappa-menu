import { PrismaClient } from "@prisma/client";

import { DESSERT_CARD_CATEGORIES } from "./dessert-card-data";

const prisma = new PrismaClient();

async function main() {
  const last = await prisma.menuCategory.aggregate({
    _max: { position: true },
  });
  let nextPosition = (last._max.position ?? 0) + 1;
  let createdCategories = 0;
  let createdItems = 0;

  for (const category of DESSERT_CARD_CATEGORIES) {
    let row = await prisma.menuCategory.findFirst({
      where: { name: category.name, menuType: "plats" },
    });

    if (!row) {
      row = await prisma.menuCategory.create({
        data: {
          name: category.name,
          position: nextPosition,
          menuType: "plats",
        },
      });
      nextPosition += 1;
      createdCategories += 1;
    }

    const existingItems = await prisma.menuItem.findMany({
      where: { categoryId: row.id },
      select: { name: true },
    });
    const known = new Set(existingItems.map((item) => item.name));
    let itemPosition = existingItems.length + 1;

    for (const item of category.items) {
      if (known.has(item.name)) continue;
      await prisma.menuItem.create({
        data: {
          categoryId: row.id,
          name: item.name,
          description: item.description,
          price: item.price,
          position: itemPosition,
        },
      });
      itemPosition += 1;
      createdItems += 1;
    }
  }

  console.log(
    `Dessert card OK — +${createdCategories} catégories, +${createdItems} plats`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
