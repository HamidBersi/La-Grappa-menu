import { BrandLogo } from "@/components/brand-logo";
import { ItaliaBar } from "@/components/italia-bar";
import type { MenuCategoryDto, MenuItemDto } from "@/components/menu/menu-types";
import { isListedOnMenu } from "@/components/menu/menu-types";
import { DishTitle } from "@/components/menu/dish-title";
import type { PrintPageSlice } from "@/components/menu/print-pagination";
import {
  formatEuro,
  hasWineTiers,
  splitWineName,
  WINE_TIER_COLUMNS,
} from "@/components/menu/wine-prices";

type MenuSheetProps = {
  categories: MenuCategoryDto[];
  categoryFilter?: "all" | string | string[];
  printSlices?: PrintPageSlice[] | null;
  measure?: boolean;
  restaurantName?: string;
  subtitle?: string;
};

const COVER_PARAGRAPHS = [
  "La Gastronomie est l’art d’utiliser la nourriture pour créer du bonheur",
  "Tous nos plats sont cuisinés maison et sont préparés sur commande à la minute..",
  "Nous avons à coeur de préparer l’ensemble de nos entrées, plats et desserts à base de produits frais, de saison et si possible fournis par nos producteurs locaux.",
  "Toute l’équipe de votre restaurant s’active en salle afin de régaler vos papilles alors prenez votre temps… L’attente, c’est la permission gratuite de profiter de l’instant présent.",
  "Un tableau d’allergènes est également disponible sur demande auprès de notre personnel.",
];

function categoryMatchesFilter(
  categoryId: string,
  filter: "all" | string | string[],
): boolean {
  if (filter === "all") return true;
  if (Array.isArray(filter)) return filter.includes(categoryId);
  return filter === categoryId;
}

function WineTable({ items }: { items: MenuItemDto[] }) {
  return (
    <table className="wine-table w-full border-collapse text-[13.5px]">
      <thead>
        <tr className="text-[11px] tracking-wide text-[#8a8578] uppercase">
          <th className="pb-1.5 pr-2 text-left font-medium">Vin</th>
          {WINE_TIER_COLUMNS.map((column) => (
            <th key={column.key} className="w-[4.8rem] pb-1.5 pr-2 text-left font-medium">
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items.map((item) => {
          const { title, style } = splitWineName(item.name);
          return (
            <tr key={item.id} data-item-id={item.id} className="wine-row border-t border-[#E8E1D4]">
              <td className="py-1.5 pr-3">
                <span className="font-[family-name:var(--font-cormorant)] text-[18px] font-semibold text-[#1B1E19]">
                  <DishTitle name={title} emoji={item.emoji} />
                </span>
                {style ? (
                  <span className="ml-1.5 text-[11px] text-[#8a8578]">{style}</span>
                ) : null}
                {item.description?.trim() ? (
                  <p className="mt-0.5 text-[12px] italic text-[#6b6a5f]">
                    {item.description}
                  </p>
                ) : null}
              </td>
              {WINE_TIER_COLUMNS.map((column) => (
                <td
                  key={column.key}
                  className="py-1.5 pr-2 text-left font-semibold tabular-nums text-black"
                >
                  {item[column.key] ? formatEuro(item[column.key]) : "—"}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function DishBlock({ item }: { item: MenuItemDto }) {
  return (
    <article className="menu-dish" data-item-id={item.id}>
      <div className="flex items-baseline gap-2">
        <span className="min-w-0 font-[family-name:var(--font-cormorant)] text-[18px] leading-tight font-semibold text-[#1B1E19]">
          <DishTitle name={item.name} emoji={item.emoji} />
        </span>
        <span
          className="mb-0.5 min-w-[1rem] flex-1 border-b border-dotted border-[#b9b19b]"
          aria-hidden
        />
        <span className="shrink-0 text-[15px] font-semibold text-black">
          {formatEuro(item.price)}
        </span>
      </div>
      {item.description?.trim() ? (
        <p className="mt-0.5 max-w-[95%] text-[13px] italic leading-snug text-[#6b6a5f]">
          {item.description}
        </p>
      ) : null}
    </article>
  );
}

function CategoryBlock({
  category,
  continuation = false,
}: {
  category: MenuCategoryDto;
  continuation?: boolean;
}) {
  const wineItems = category.items.filter((item) => hasWineTiers(item));
  const otherItems = category.items.filter((item) => !hasWineTiers(item));
  const asWineTable = wineItems.length > 0 && otherItems.length === 0;

  return (
    <section className="menu-cat" data-category-id={category.id}>
      {continuation ? null : (
        <h2 className="menu-cat-title mb-3 flex items-center gap-3 font-[family-name:var(--font-cormorant)] text-[28px] font-semibold leading-none text-leaf">
          <span>{category.name}</span>
          <span className="h-px flex-1 bg-[#D9CFB8]" aria-hidden />
        </h2>
      )}

      {asWineTable ? (
        <WineTable items={wineItems} />
      ) : (
        <div className="space-y-1.5 print:space-y-1.5">
          {category.items.map((item) => (
            <DishBlock key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}

function MenuCover() {
  return (
    <section className="menu-cover">
      <div className="menu-cover-brand">
        <BrandLogo size={72} className="menu-cover-mark" alt="" />
        <p className="menu-cover-name">La Grappa</p>
        <p className="menu-cover-tag">Restaurant italien</p>
      </div>

      <div className="menu-cover-frame">
        {COVER_PARAGRAPHS.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

export function MenuSheet({
  categories,
  categoryFilter = "all",
  printSlices = null,
  measure = false,
  restaurantName = "La Grappa",
  subtitle = "Cuisine italienne",
}: MenuSheetProps) {
  const showCover = categoryFilter === "all";
  const visibleCategories = categories
    .filter((category) => categoryMatchesFilter(category.id, categoryFilter))
    .map((category) => ({
      ...category,
      items: category.items.filter((item) => isListedOnMenu(item)),
    }))
    .filter((category) => category.items.length > 0);

  if (printSlices && printSlices.length > 0) {
    return (
      <div className="menu-sheet menu-print-pages mx-auto w-full px-4 py-6 sm:px-6 print:max-w-none print:p-0">
        {printSlices.map((slice) => (
          <section key={slice.page} className="menu-print-page">
            {slice.isCover ? (
              <MenuCover />
            ) : (
              <div className="menu-stack">
                {slice.sections.map((section) => (
                  <CategoryBlock
                    key={`${slice.page}-${section.categoryId}-${section.continuation ? "c" : "s"}`}
                    continuation={section.continuation}
                    category={{
                      id: section.categoryId,
                      name: section.categoryName,
                      position: 0,
                      items: section.items,
                    }}
                  />
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`menu-sheet mx-auto w-full max-w-[720px] px-10 py-10 sm:px-12 print:max-w-none print:p-0${
        measure ? " menu-sheet--measure" : ""
      }`}
    >
      {showCover ? (
        <MenuCover />
      ) : (
        <header className="menu-sheet-header mb-9 text-center">
          <h1 className="font-[family-name:var(--font-cormorant)] text-[42px] leading-none font-semibold text-leaf sm:text-[44px]">
            {restaurantName}
          </h1>
          <ItaliaBar className="mx-auto my-3.5 h-[3px] w-[70px]" />
          <p className="text-[13.5px] tracking-wide text-[#6b6a5f]">{subtitle}</p>
        </header>
      )}

      {visibleCategories.length === 0 ? (
        <p className="text-center text-sm text-[#6b6a5f]">
          Aucun plat disponible pour le moment.
        </p>
      ) : (
        <div className="menu-stack">
          {visibleCategories.map((category) => (
            <CategoryBlock key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
}
