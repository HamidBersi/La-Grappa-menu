import type { MenuLocale } from "@/components/menu/i18n/locale";
import { familyForCategoryName } from "@/components/menu/menu-groups";

export const CATEGORY_LABELS: Record<
  string,
  Record<Exclude<MenuLocale, "fr">, string>
> = {
  Apéritifs: { en: "Aperitifs", de: "Aperitifs", it: "Aperitivi" },
  "Sans alcool": { en: "Soft drinks", de: "Alkoholfrei", it: "Analcolici" },
  "Nos Entrées": { en: "Starters", de: "Vorspeisen", it: "Antipasti" },
  "Nos Viandes": { en: "Meat", de: "Fleisch", it: "Carni" },
  "Nos Pâtes": { en: "Pasta", de: "Pasta", it: "Pasta" },
  "Pâtes fraîches": { en: "Fresh pasta", de: "Frische Pasta", it: "Pasta fresca" },
  "Nos Pizzas": { en: "Pizzas", de: "Pizzen", it: "Pizze" },
  "Vins blancs": { en: "White wines", de: "Weißweine", it: "Vini bianchi" },
  "Vins rosés": { en: "Rosé wines", de: "Roséweine", it: "Vini rosati" },
  "Vins rouges": { en: "Red wines", de: "Rotweine", it: "Vini rossi" },
  "Sélection cave": { en: "Cellar selection", de: "Kellerauswahl", it: "Selezione cantina" },
  Spumante: { en: "Sparkling", de: "Sekt", it: "Spumante" },
  "Nos Desserts": { en: "Desserts", de: "Desserts", it: "Dolci" },
  "Cafés, Infusions": {
    en: "Coffee & teas",
    de: "Kaffee & Tee",
    it: "Caffè e infusi",
  },
  Digestifs: { en: "Digestifs", de: "Digestifs", it: "Digestivi" },
};

export const CATEGORY_CHIP_LABELS: Record<
  string,
  Record<Exclude<MenuLocale, "fr">, string>
> = {
  "Sans alcool": { en: "Soft drinks", de: "Ohne Alkohol", it: "Analcolici" },
  "Nos Entrées": { en: "Starters", de: "Vorspeisen", it: "Antipasti" },
  "Nos Viandes": { en: "Meat", de: "Fleisch", it: "Carni" },
  "Nos Pâtes": { en: "Pasta", de: "Pasta", it: "Pasta" },
  "Pâtes fraîches": { en: "Fresh pasta", de: "Frisch", it: "Fresca" },
  "Nos Pizzas": { en: "Pizzas", de: "Pizzen", it: "Pizze" },
  "Vins blancs": { en: "White", de: "Weiß", it: "Bianchi" },
  "Vins rosés": { en: "Rosé", de: "Rosé", it: "Rosati" },
  "Vins rouges": { en: "Red", de: "Rot", it: "Rossi" },
  "Sélection cave": { en: "Cellar", de: "Keller", it: "Cantina" },
  "Nos Desserts": { en: "Desserts", de: "Desserts", it: "Dolci" },
  "Cafés, Infusions": { en: "Coffee", de: "Kaffee", it: "Caffè" },
  Digestifs: { en: "Digestifs", de: "Digestifs", it: "Digestivi" },
};

export function translateCategoryName(name: string, locale: MenuLocale): string {
  if (locale === "fr") return name;
  return CATEGORY_LABELS[name]?.[locale] ?? name;
}

export function translateCategoryChip(name: string, locale: MenuLocale): string {
  const frShort = familyForCategoryName(name)?.chipLabelByName?.[name] ?? name;
  if (locale === "fr") return frShort;
  return CATEGORY_CHIP_LABELS[name]?.[locale] ?? CATEGORY_LABELS[name]?.[locale] ?? frShort;
}
