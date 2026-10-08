"use client";

import { useEffect, useMemo, useState } from "react";

import {
  tFamily,
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
import { formatEuro, hasWineTiers } from "@/components/menu/wine-prices";
import {
  MenuTopNav,
  readStoredMenuLocale,
  storeMenuLocale,
} from "@/components/menu/menu-top-nav";

type DigitalMenuProps = {
  categories: MenuCategoryDto[];
};

function splitNameAndVolume(name: string): { title: string; volume: string | null } {
  const match = name.match(/^(.*?)\s+(\d+(?:[.,]\d+)?\s*cl)\s*$/i);
  if (!match) return { title: name, volume: null };
  return { title: match[1], volume: match[2].replace(/\s+/g, "") };
}

export function DigitalMenu({ categories }: DigitalMenuProps) {
  const [familyId, setFamilyId] = useState<MenuFamilyId>("all");
  const [subCategoryName, setSubCategoryName] = useState<string | null>(null);
  const [locale, setLocale] = useState<MenuLocale>("fr");
  const ui = tUi(locale);

  useEffect(() => {
    const stored = readStoredMenuLocale();
    setLocale(stored);
    document.documentElement.lang = stored;
  }, []);

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
      return sectionsForFamily(activeFamily).map((category) => ({
        category,
        family: activeFamily,
      }));
    }

    const grouped = MENU_FAMILIES.flatMap((family) =>
      sectionsForFamily(family).map((category) => ({ category, family })),
    );

    const named = new Set(MENU_FAMILIES.flatMap((family) => family.categoryNames));
    const leftovers = available
      .filter((category) => !named.has(category.name))
      .map((category) => ({
        category,
        family: {
          id: "piatti" as const,
          label: "",
          categoryNames: [] as string[],
          countNoun: tFamily(locale, "piatti").countNoun,
        },
      }));

    return [...grouped, ...leftovers];
  }, [activeFamily, categories, locale, subCategoryName]);

  function selectFamily(next: MenuFamilyId) {
    setFamilyId(next);
    setSubCategoryName(null);
  }

  function countNounFor(family: MenuFamily): string {
    if (!family.id || family.id === ("all" as string)) {
      return tFamily(locale, "piatti").countNoun;
    }
    return tFamily(locale, family.id).countNoun;
  }

  return (
    <div className="mx-auto min-h-full w-full min-w-0 max-w-2xl pb-24">
      <div className="sticky top-0 z-30 min-w-0 bg-[#F4F1EA]/95 backdrop-blur-sm">
        <MenuTopNav locale={locale} onLocaleChange={handleLocaleChange} />
        <div className="min-w-0 px-4 py-3 sm:px-6">
          <MenuFamilyBar
            familyId={familyId}
            onFamilyChange={selectFamily}
            subCategoryName={subCategoryName}
            onSubCategoryChange={setSubCategoryName}
            categoryNames={categories.map((category) => category.name)}
            locale={locale}
          />
        </div>
      </div>

      <div className="mt-6 space-y-10 overflow-x-hidden px-4 sm:px-6">
        {visibleSections.length === 0 ? (
          <p className="text-center text-sm text-[#6b675c]">{ui.emptyCategory}</p>
        ) : (
          visibleSections.map(({ category, family }) => (
            <section key={category.id}>
              <div className="mb-4 flex min-w-0 items-baseline justify-between gap-3">
                <h2 className="min-w-0 flex-1 font-[family-name:var(--font-cormorant)] text-[28px] leading-none font-bold italic text-[#8F6A24]">
                  {translateCategoryName(category.name, locale)}
                </h2>
                <span className="shrink-0 text-[13px] text-[#8a8578]">
                  {category.items.length} {countNounFor(family)}
                </span>
              </div>

              <div className="space-y-5">
                {category.items.map((item) => (
                  <DishRow key={item.id} item={item} locale={locale} />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}

function WineRow({ item, locale }: { item: MenuItemDto; locale: MenuLocale }) {
  const ui = tUi(locale);
  const translated = translateItem(locale, item.name, item.description);
  const headline = item.priceVerre || item.priceBouteille || item.price;
  const formats = [
    { key: "priceQuart" as const, label: ui.wineQuart },
    { key: "priceDemi" as const, label: ui.wineDemi },
    { key: "priceBouteille" as const, label: ui.wineBottle },
  ].filter((column) => {
    if (!item[column.key]) return false;
    if (column.key === "priceBouteille" && !item.priceVerre) return false;
    return true;
  });

  return (
    <article className="min-w-0">
      <div className="flex min-w-0 items-baseline gap-2">
        <h3 className="min-w-0 text-[15.5px] font-semibold break-words text-[#1B1E19]">
          <DishTitle name={translated.name} emoji={item.emoji} />
        </h3>
        <span
          className="mb-1 min-w-[1.25rem] flex-1 border-b border-dotted border-[#cfc8b8]"
          aria-hidden
        />
        <span className="shrink-0 text-[15px] font-semibold tabular-nums text-[#1B1E19]">
          {formatEuro(headline)}
        </span>
      </div>
      {formats.length > 0 ? (
        <p className="mt-1 flex flex-wrap gap-x-3.5 gap-y-0.5 text-[13px] font-normal text-[#7a766c]">
          {formats.map((column) => (
            <span key={column.key} className="tabular-nums">
              {column.label} {formatEuro(item[column.key])}
            </span>
          ))}
        </p>
      ) : null}
      {translated.description ? (
        <p className="mt-1 max-w-[92%] text-[13px] leading-snug text-[#7a766c]">
          {translated.description}
        </p>
      ) : null}
    </article>
  );
}

function DishRow({ item, locale }: { item: MenuItemDto; locale: MenuLocale }) {
  if (hasWineTiers(item)) {
    return <WineRow item={item} locale={locale} />;
  }

  const translated = translateItem(locale, item.name, item.description);
  const { title, volume } = splitNameAndVolume(translated.name);

  return (
    <article className="min-w-0">
      <div className="flex min-w-0 items-baseline gap-2">
        <h3 className="min-w-0 text-[15.5px] font-semibold break-words text-[#1B1E19]">
          <DishTitle name={title} emoji={item.emoji} />
          {volume ? (
            <span className="ml-1.5 font-normal text-[#8a8578]">{volume}</span>
          ) : null}
        </h3>
        <span
          className="mb-1 min-w-[1.25rem] flex-1 border-b border-dotted border-[#cfc8b8]"
          aria-hidden
        />
        <span className="shrink-0 text-[15px] font-semibold tabular-nums text-[#1B1E19]">
          {formatEuro(item.price)}
        </span>
      </div>
      {translated.description ? (
        <p className="mt-0.5 max-w-[92%] text-[13px] leading-snug text-[#7a766c]">
          {translated.description}
        </p>
      ) : null}
    </article>
  );
}
