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
import { formatEuro, hasWineTiers } from "@/components/menu/wine-prices";
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
              <header className="border-b border-ink/6 px-5 pt-5 pb-3.5 sm:px-6">
                <h2 className="min-w-0 font-[family-name:var(--font-cormorant)] text-[26px] leading-none font-semibold text-leaf">
                  {translateCategoryName(category.name, locale)}
                </h2>
              </header>

              <div className="divide-y divide-ink/6 px-5 sm:px-6">
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
    <article className="min-w-0 py-3.5">
      <div className="flex min-w-0 items-start justify-between gap-4">
        <h3 className="min-w-0 text-[15.5px] leading-snug font-medium break-words text-ink">
          <DishTitle name={translated.name} emoji={item.emoji} />
        </h3>
        <span className="shrink-0 pt-0.5 text-[15px] font-semibold tabular-nums text-wine">
          {formatEuro(headline)}
        </span>
      </div>
      {formats.length > 0 ? (
        <p className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[12.5px] text-ink/50">
          {formats.map((column) => (
            <span key={column.key} className="tabular-nums">
              {column.label} {formatEuro(item[column.key])}
            </span>
          ))}
        </p>
      ) : null}
      {translated.description ? (
        <p className="mt-1 max-w-[36rem] text-[13px] leading-relaxed text-ink/55">
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
    <article className="min-w-0 py-3.5">
      <div className="flex min-w-0 items-start justify-between gap-4">
        <h3 className="min-w-0 text-[15.5px] leading-snug font-medium break-words text-ink">
          <DishTitle name={title} emoji={item.emoji} />
          {volume ? (
            <span className="ml-1.5 font-normal text-ink/45">{volume}</span>
          ) : null}
        </h3>
        <span className="shrink-0 pt-0.5 text-[15px] font-semibold tabular-nums text-wine">
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
