import { ItaliaBar } from "@/components/italia-bar";
import type { MenuCategoryDto, MenuItemDto } from "@/components/menu/menu-types";
import { isListedOnMenu } from "@/components/menu/menu-types";
import { DishTitle } from "@/components/menu/dish-title";
import {
  isPrintFooterDish,
  printNotesFor,
} from "@/components/menu/print-notes";
import type { PrintPageSlice } from "@/components/menu/print-pagination";
import {
  formatEuro,
  hasWineTiers,
  splitWineName,
} from "@/components/menu/wine-prices";

type MenuSheetProps = {
  categories: MenuCategoryDto[];
  categoryFilter?: "all" | string | string[];
  printSlices?: PrintPageSlice[] | null;
  measure?: boolean;
  subtitle?: string;
};

const PRINT_TITLES: Record<string, string> = {
  "Sans alcool": "Sans Alcool",
  "Pâtes fraîches": "Pâtes Fraîches",
  "Vins blancs": "Blancs",
  "Vins rosés": "Rosés",
  "Vins rouges": "Rouges",
  "Sélection cave": "Selection Cave",
};

const PRINT_WINE_COLUMNS = [
  { key: "priceVerre" as const, label: "verre", volume: "12 cl" },
  { key: "priceQuart" as const, label: "quart", volume: "25 cl" },
  { key: "priceDemi" as const, label: "demi", volume: "50 cl" },
  { key: "priceBouteille" as const, label: "bouteille", volume: "75 cl" },
];

const VOLUME_PATTERN = /^\d+(?:[.,]\d+)?\s*cl$/i;

function printCategoryTitle(name: string): string {
  return PRINT_TITLES[name] ?? name;
}

function volumeFromDescription(description: string | null | undefined): string | null {
  const trimmed = description?.trim() ?? "";
  if (!trimmed) return null;
  return VOLUME_PATTERN.test(trimmed) ? trimmed.replace(/\s+/g, " ") : null;
}

function formatPrintPrice(price: string | null | undefined): string {
  const formatted = formatEuro(price);
  return formatted || "-";
}

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
    <table className="wine-table w-full table-fixed border-collapse">
      <colgroup>
        <col />
        {PRINT_WINE_COLUMNS.map((column) => (
          <col key={column.key} className="w-[15%]" />
        ))}
      </colgroup>
      <thead>
        <tr>
          <th className="pb-1.5 pr-2 text-left font-normal" />
          {PRINT_WINE_COLUMNS.map((column) => (
            <th
              key={column.key}
              className="wine-col-head pb-1.5 pl-1 text-right font-normal leading-tight"
            >
              <span className="wine-col-vol">{column.volume}</span>
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items.map((item) => {
          const { title } = splitWineName(item.name);
          return (
            <tr key={item.id} data-item-id={item.id} className="wine-row">
              <td className="pr-2 align-top">
                <span className="wine-name">
                  <DishTitle name={title} emoji={item.emoji} />
                </span>
                {item.description?.trim() ? (
                  <p className="menu-dish-desc">{item.description}</p>
                ) : null}
              </td>
              {PRINT_WINE_COLUMNS.map((column) => (
                <td
                  key={column.key}
                  className="whitespace-nowrap pl-1 text-right align-top font-semibold tabular-nums text-black"
                >
                  {item[column.key] ? formatPrintPrice(item[column.key]) : "-"}
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
  const volume = volumeFromDescription(item.description);
  const extraDescription = volume ? null : item.description?.trim() || null;
  const descInParens =
    extraDescription && !extraDescription.startsWith("(")
      ? `(${extraDescription})`
      : extraDescription;

  return (
    <article className="menu-dish" data-item-id={item.id}>
      <div className="flex items-baseline gap-2">
        <span className="menu-dish-name min-w-0">
          <DishTitle name={item.name} emoji={item.emoji} />
        </span>
        <span
          className="mb-0.5 min-w-[1rem] flex-1 border-b border-dotted border-[#b0b0b0]"
          aria-hidden
        />
        {volume ? <span className="menu-dish-volume shrink-0">{volume}</span> : null}
        <span className="menu-dish-price shrink-0">{formatPrintPrice(item.price)}</span>
      </div>
      {descInParens ? <p className="menu-dish-desc">{descInParens}</p> : null}
    </article>
  );
}

function sectionsToBlocks(sections: PrintPageSlice["sections"]) {
  const blocks: PrintPageSlice["sections"][] = [];
  for (let index = 0; index < sections.length; index += 1) {
    const current = sections[index];
    const next = sections[index + 1];
    if (
      current.categoryName === "Cafés, Infusions" &&
      next?.categoryName === "Digestifs"
    ) {
      blocks.push([current, next]);
      index += 1;
    } else {
      blocks.push([current]);
    }
  }
  return blocks;
}

function splitSupplement(text: string): { label: string; price: string | null } {
  const parts = text.split(/\s+·\s+/);
  if (parts.length >= 2) {
    return {
      label: parts.slice(0, -1).join(" · "),
      price: parts[parts.length - 1] ?? null,
    };
  }
  return { label: text, price: null };
}

function PrintNoteBlock({ categoryName }: { categoryName: string }) {
  const note = printNotesFor(categoryName);
  if (!note) return null;
  return (
    <aside className="menu-print-note">
      {note.lines.map((line) => {
        if (line.kind === "supplement") {
          const { label, price } = splitSupplement(line.text);
          return (
            <p key={line.text} className="menu-print-note-plus">
              <span>{label}</span>
              {price ? (
                <span className="menu-print-note-price">{price}</span>
              ) : null}
            </p>
          );
        }
        return (
          <p key={line.text} className="menu-print-note-text">
            {line.text}
          </p>
        );
      })}
    </aside>
  );
}

function CategoryBlock({ category }: { category: MenuCategoryDto }) {
  const listedItems = category.items.filter((item) => !isPrintFooterDish(item.name));
  const wineItems = listedItems.filter((item) => hasWineTiers(item));
  const otherItems = listedItems.filter((item) => !hasWineTiers(item));
  const asWineTable = wineItems.length > 0 && otherItems.length === 0;

  return (
    <section className="menu-cat" data-category-id={category.id}>
      <h2 className="menu-cat-title">{printCategoryTitle(category.name)}</h2>

      {asWineTable ? (
        <WineTable items={wineItems} />
      ) : (
        <div className="menu-dish-list">
          {listedItems.map((item) => (
            <DishBlock key={item.id} item={item} />
          ))}
        </div>
      )}
      <PrintNoteBlock categoryName={category.name} />
    </section>
  );
}

export function MenuSheet({
  categories,
  categoryFilter = "all",
  printSlices = null,
  measure = false,
  subtitle = "Cuisine italienne",
}: MenuSheetProps) {
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
          <section
            key={slice.page}
            className={`menu-print-page${slice.tight ? " menu-print-page--tight" : ""}`}
          >
            <div className="menu-stack">
              {sectionsToBlocks(slice.sections).map((block) => {
                if (block.length === 2) {
                  return (
                    <div
                      key={`${slice.page}-pair`}
                      className="menu-print-pair"
                    >
                      {block.map((section) => (
                        <CategoryBlock
                          key={`${slice.page}-${section.categoryId}`}
                          category={{
                            id: section.categoryId,
                            name: section.categoryName,
                            position: 0,
                            items: section.items,
                          }}
                        />
                      ))}
                    </div>
                  );
                }
                const section = block[0];
                return (
                  <CategoryBlock
                    key={`${slice.page}-${section.categoryId}`}
                    category={{
                      id: section.categoryId,
                      name: section.categoryName,
                      position: 0,
                      items: section.items,
                    }}
                  />
                );
              })}
            </div>
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
      {measure ? null : (
        <header className="menu-sheet-header mb-9 text-center">
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
