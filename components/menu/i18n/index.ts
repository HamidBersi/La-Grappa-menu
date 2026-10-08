import {
  translateCategoryChip,
  translateCategoryName,
} from "@/components/menu/i18n/categories";
import { ITEM_TRANSLATIONS } from "@/components/menu/i18n/items";
import type { MenuLocale } from "@/components/menu/i18n/locale";
import { UI } from "@/components/menu/i18n/ui";
import type { MenuFamilyId } from "@/components/menu/menu-groups";

export type { MenuLocale } from "@/components/menu/i18n/locale";
export {
  LOCALE_LABELS,
  MENU_LOCALES,
  readStoredMenuLocale,
  storeMenuLocale,
} from "@/components/menu/i18n/locale";
export { translateCategoryChip, translateCategoryName };

const COLOR_FALLBACKS: Record<Exclude<MenuLocale, "fr">, [RegExp, string][]> = {
  en: [
    [/\(rouge\/blanc\)/gi, "(red/white)"],
    [/\(rouge\)/gi, "(red)"],
    [/\(blanc\)/gi, "(white)"],
    [/\(rosé\)/gi, "(rosé)"],
    [/\(bio\)/gi, "(organic)"],
  ],
  de: [
    [/\(rouge\/blanc\)/gi, "(rot/weiß)"],
    [/\(rouge\)/gi, "(rot)"],
    [/\(blanc\)/gi, "(weiß)"],
    [/\(rosé\)/gi, "(Rosé)"],
    [/\(bio\)/gi, "(bio)"],
  ],
  it: [
    [/\(rouge\/blanc\)/gi, "(rosso/bianco)"],
    [/\(rouge\)/gi, "(rosso)"],
    [/\(blanc\)/gi, "(bianco)"],
    [/\(rosé\)/gi, "(rosato)"],
    [/\(bio\)/gi, "(biologico)"],
  ],
};

function applyColorFallback(name: string, locale: Exclude<MenuLocale, "fr">): string {
  let result = name;
  for (const [pattern, replacement] of COLOR_FALLBACKS[locale]) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

export function tUi(locale: MenuLocale) {
  return UI[locale];
}

export function tFamily(
  locale: MenuLocale,
  familyId: Exclude<MenuFamilyId, "all">,
): { label: string; navLabel?: string; countNoun: string } {
  return UI[locale].families[familyId];
}

export function translateItem(
  locale: MenuLocale,
  name: string,
  description: string | null | undefined,
): { name: string; description: string | null } {
  const desc = description?.trim() ? description : null;
  if (locale === "fr") {
    return { name, description: desc };
  }

  const entry = ITEM_TRANSLATIONS[name]?.[locale];
  const translatedName = entry?.name ?? applyColorFallback(name, locale);
  const translatedDescription = entry?.description ?? desc;

  return {
    name: translatedName,
    description: translatedDescription,
  };
}
