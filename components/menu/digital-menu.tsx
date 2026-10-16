"use client";

import { useEffect, useMemo, useState } from "react";

import {
  tUi,
  translateCategoryName,
  translateItem,
  type MenuLocale,
} from "@/components/menu/i18n";
import {
  MENU_FAMILIES,
  type MenuFamily,
  type MenuFamilyId,
} from "@/components/menu/menu-groups";
import { MenuFamilyBar } from "@/components/menu/menu-family-bar";
import { DishTitle } from "@/components/menu/dish-title";
import type { MenuCategoryDto, MenuItemDto } from "@/components/menu/menu-types";
import { isListedOnMenu } from "@/components/menu/menu-types";
import {
  PRINT_NOTES,
  isPrintFooterDish,
  noteLineText,
} from "@/components/menu/print-notes";
import {
  formatEuro,
  hasWineTiers,
  WINE_TIER_COLUMNS,
} from "@/components/menu/wine-prices";
import {
  MenuTopNav,
  readStoredMenuLocale,
  storeMenuLocale,
} from "@/components/menu/menu-top-nav";

type DigitalMenuProps = {
  categories: MenuCategoryDto[];
  /** Aperçu admin : pas de bouton retour */
  embedded?: boolean;
};

function splitNameAndVolume(name: string): { title: string; volume: string | null } {
  const match = name.match(/^(.*?)\s+(\d+(?:[.,]\d+)?\s*cl)\s*$/i);
  if (!match) return { title: name, volume: null };
  return { title: match[1], volume: match[2].replace(/\s+/g, "") };
}

export function DigitalMenu({ categories, embedded = false }: DigitalMenuProps) {
  const [familyId, setFamilyId] = useState<MenuFamilyId>("all");
  const [subCategoryName, setSubCategoryName] = useState<string | null>(null);
  const [locale, setLocale] = useState<MenuLocale>("fr");
  const [showBack, setShowBack] = useState(false);
  const ui = tUi(locale);

  useEffect(() => {
    const stored = readStoredMenuLocale();
    setLocale(stored);
    document.documentElement.lang = stored;
  }, []);

  useEffect(() => {
    if (embedded) {
      setShowBack(false);
      return;
    }
    const fromApp = new URLSearchParams(window.location.search).get("from") === "app";
    setShowBack(fromApp);
  }, [embedded]);

  function handleLocaleChange(next: MenuLocale) {
    setLocale(next);
    storeMenuLocale(next);
    document.documentElement.lang = next;
  }

  const activeFamily =
    familyId === "all"
      ? null
      : (MENU_FAMILIES.find((family) => family.id === familyId) ?? null);

  const visibleSections = useMemo(() => {
    const available = categories
      .map((category) => ({
        ...category,
        items: category.items.filter((item) => isListedOnMenu(item)),
      }))
      .filter((category) => category.items.length > 0);

    const byName = new Map(available.map((category) => [category.name, category]));

    function sectionsForFamily(family: MenuFamily) {
      return family.categoryNames
        .filter((name) => (subCategoryName ? name === subCategoryName : true))
        .map((name) => byName.get(name))
        .filter((category): category is MenuCategoryDto => Boolean(category));
    }

    if (activeFamily) {
      return sectionsForFamily(activeFamily);
    }

    const grouped = MENU_FAMILIES.flatMap((family) => sectionsForFamily(family));
    const named = new Set(MENU_FAMILIES.flatMap((family) => family.categoryNames));
    const leftovers = available.filter((category) => !named.has(category.name));

    return [...grouped, ...leftovers];
  }, [activeFamily, categories, subCategoryName]);

  function selectFamily(next: MenuFamilyId) {
    setFamilyId(next);
    setSubCategoryName(null);
  }

  return (
    <div className="mx-auto min-h-full w-full min-w-0 max-w-3xl pb-24">
      <div className="sticky top-0 z-30 min-w-0 bg-paper/90 backdrop-blur-md">
        <MenuTopNav
          locale={locale}
          onLocaleChange={handleLocaleChange}
          showBack={showBack}
        />
        <div className="min-w-0 border-y border-ink/12 bg-paper-nav px-4 py-3 sm:px-6">
          <MenuFamilyBar
            familyId={familyId}
            onFamilyChange={selectFamily}
            subCategoryName={subCategoryName}
            onSubCategoryChange={setSubCategoryName}
            categoryNames={categories.map((category) => category.name)}
            locale={locale}
            fadeFromClass="from-paper-nav"
          />
        </div>
      </div>

      <div className="mt-5 space-y-5 overflow-x-hidden px-4 sm:mt-7 sm:px-6">
        {visibleSections.length === 0 ? (
          <p className="py-16 text-center text-sm text-ink/55">{ui.emptyCategory}</p>
        ) : (
          visibleSections.map((category) => (
            <section
              key={category.id}
              className="overflow-hidden rounded-2xl bg-white/85 shadow-[0_8px_28px_rgba(31,26,23,0.05)] ring-1 ring-ink/6"
            >
              <CategoryBody
                title={translateCategoryName(category.name, locale)}
                items={
                  PRINT_NOTES[category.name]
                    ? category.items.filter((item) => !isPrintFooterDish(item.name))
                    : category.items
                }
                locale={locale}
              />
              <DigitalNoteBlock categoryName={category.name} locale={locale} />
            </section>
          ))
        )}
      </div>
    </div>
  );
}

const WINE_LABELS = {
  priceVerre: "wineGlass",
  priceQuart: "wineQuart",
  priceDemi: "wineDemi",
  priceBouteille: "wineBottle",
} as const;

function CategoryBody({
  title,
  items,
  locale,
}: {
  title: string;
  items: MenuItemDto[];
  locale: MenuLocale;
}) {
  const wineItems = items.filter((item) => hasWineTiers(item));
  const otherItems = items.filter((item) => !hasWineTiers(item));
  if (wineItems.length > 0 && otherItems.length === 0) {
    return <DigitalWineTable title={title} items={wineItems} locale={locale} />;
  }
  return (
    <>
      <header className="border-b border-ink/6 px-5 pt-5 pb-3.5 sm:px-6">
        <h2 className="min-w-0 font-[family-name:var(--font-cormorant)] text-[26px] leading-none font-semibold text-leaf">
          {title}
        </h2>
      </header>
      <div className="divide-y divide-ink/6 px-5 sm:px-6">
        {items.map((item) => (
          <DishRow key={item.id} item={item} locale={locale} />
        ))}
      </div>
    </>
  );
}

function DigitalWineTable({
  title,
  items,
  locale,
}: {
  title: string;
  items: MenuItemDto[];
  locale: MenuLocale;
}) {
  const ui = tUi(locale);
  return (
    <>
      <header className="border-b border-ink/6 px-5 pt-5 pb-3.5 md:hidden">
        <h2 className="min-w-0 font-[family-name:var(--font-cormorant)] text-[26px] leading-none font-semibold text-leaf">
          {title}
        </h2>
        <p className="mt-2 text-[12px] leading-snug text-ink/45">
          {WINE_TIER_COLUMNS.map((column, index) => (
            <span key={column.key}>
              {index > 0 ? <span className="mx-1.5 text-ink/20">·</span> : null}
              {ui[WINE_LABELS[column.key]]} {column.volume}
            </span>
          ))}
        </p>
      </header>
      <div className="divide-y divide-ink/6 px-5 md:hidden">
        {items.map((item) => (
          <MobileWineCard key={item.id} item={item} locale={locale} />
        ))}
      </div>
      <div className="hidden px-6 pb-1 md:block">
        <table className="w-full table-fixed border-collapse">
          <colgroup>
            <col />
            {WINE_TIER_COLUMNS.map((column) => (
              <col key={column.key} className="w-[15%]" />
            ))}
          </colgroup>
          <thead>
            <tr className="border-b border-ink/8">
              <th className="pt-5 pb-2.5 pr-3 text-left align-bottom">
                <h2 className="min-w-0 font-[family-name:var(--font-cormorant)] text-[26px] leading-none font-semibold text-leaf">
                  {title}
                </h2>
              </th>
              {WINE_TIER_COLUMNS.map((column) => (
                <th
                  key={column.key}
                  className="pt-5 pb-2.5 pl-2 text-right align-bottom font-normal leading-tight"
                >
                  <span className="block text-[13px] font-medium text-ink/70">
                    {column.volume}
                  </span>
                  <span className="block font-[family-name:var(--font-cormorant)] text-[16px] font-semibold text-ink/85 italic">
                    {ui[WINE_LABELS[column.key]]}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const translated = translateItem(locale, item.name, item.description);
              return (
                <tr key={item.id} className="border-b border-ink/6 last:border-b-0">
                  <td className="py-3.5 pr-3 align-top">
                    <h3 className="min-w-0 text-[15px] leading-snug font-medium break-words text-ink">
                      <DishTitle name={translated.name} emoji={item.emoji} />
                    </h3>
                    {translated.description ? (
                      <p className="mt-1 text-[12.5px] leading-relaxed text-ink/50">
                        {translated.description}
                      </p>
                    ) : null}
                  </td>
                  {WINE_TIER_COLUMNS.map((column) => (
                    <td
                      key={column.key}
                      className="whitespace-nowrap py-3.5 pl-2 text-right align-top text-[14px] font-semibold tabular-nums text-ink"
                    >
                      {item[column.key] ? formatEuro(item[column.key]) : (
                        <span className="font-normal text-ink/25">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function MobileWineCard({
  item,
  locale,
}: {
  item: MenuItemDto;
  locale: MenuLocale;
}) {
  const translated = translateItem(locale, item.name, item.description);
  const formats = WINE_TIER_COLUMNS.filter((column) => Boolean(item[column.key]));
  const onlyOne = formats.length <= 1;
  const headline = formats[0];

  return (
    <article className="min-w-0 py-3">
      <div className="flex min-w-0 items-start justify-between gap-4">
        <h3 className="min-w-0 text-[15.5px] leading-snug font-medium break-words text-ink">
          <DishTitle name={translated.name} emoji={item.emoji} />
        </h3>
        {onlyOne && headline ? (
          <span className="shrink-0 pt-0.5 text-[15px] font-semibold tabular-nums text-ink">
            {formatEuro(item[headline.key])}
          </span>
        ) : null}
      </div>
      {translated.description ? (
        <p className="mt-1 text-[12.5px] leading-relaxed text-ink/50">
          {translated.description}
        </p>
      ) : null}
      {!onlyOne ? (
        <p className="mt-1.5 flex flex-wrap items-baseline gap-x-1.5 text-[13px] leading-relaxed">
          {WINE_TIER_COLUMNS.map((column, index) => (
            <span key={column.key} className="inline-flex items-baseline">
              {index > 0 ? <span className="mr-1.5 text-ink/20">·</span> : null}
              <span className="font-semibold tabular-nums text-ink">
                {item[column.key] ? (
                  formatEuro(item[column.key])
                ) : (
                  <span className="font-normal text-ink/25">—</span>
                )}
              </span>
            </span>
          ))}
        </p>
      ) : null}
    </article>
  );
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

function DigitalNoteBlock({
  categoryName,
  locale,
}: {
  categoryName: string;
  locale: MenuLocale;
}) {
  const note = PRINT_NOTES[categoryName];
  if (!note) return null;
  return (
    <aside className="border-t border-ink/6 px-5 py-4 sm:px-6">
      <div className="rounded-xl border border-[#e2d4bc] bg-[#f8f3ea] px-4 py-3 text-center">
        {note.lines.map((line, index) => {
          const text = noteLineText(line, locale);
          const spacing = index > 0 ? "mt-1.5" : "";
          if (line.kind === "supplement") {
            const { label, price } = splitSupplement(text);
            return (
              <p
                key={line.text}
                className={`font-[family-name:var(--font-cormorant)] text-[15px] font-semibold text-ink ${spacing}`}
              >
                {label}
                {price ? (
                  <span className="ml-2.5 text-wine">{price}</span>
                ) : null}
              </p>
            );
          }
          return (
            <p
              key={line.text}
              className={`font-[family-name:var(--font-cormorant)] text-[13.5px] leading-relaxed text-ink/65 italic ${spacing}`}
            >
              {text}
            </p>
          );
        })}
      </div>
    </aside>
  );
}

function DishRow({ item, locale }: { item: MenuItemDto; locale: MenuLocale }) {
  const translated = translateItem(locale, item.name, item.description);
  const { title, volume } = splitNameAndVolume(translated.name);

  return (
    <article className="min-w-0 py-3.5">
      <div className="flex min-w-0 items-start justify-between gap-4">
        <h3 className="min-w-0 text-[15.5px] leading-snug font-medium break-words text-ink">
          <DishTitle name={title} emoji={item.emoji} />
          {volume ? (
            <span className="ml-1.5 font-normal text-ink/45">{volume}</span>
          ) : null}
        </h3>
        <span className="shrink-0 pt-0.5 text-[15px] font-semibold tabular-nums text-ink">
          {formatEuro(item.price)}
        </span>
      </div>
      {translated.description ? (
        <p className="mt-1 max-w-[36rem] text-[13px] leading-relaxed text-ink/55">
          {translated.description}
        </p>
      ) : null}
    </article>
  );
}
