export type MenuLocale = "fr" | "en" | "de" | "it";

export const MENU_LOCALES: MenuLocale[] = ["fr", "en", "de", "it"];

export const LOCALE_LABELS: Record<MenuLocale, string> = {
  fr: "Français",
  en: "English",
  de: "Deutsch",
  it: "Italiano",
};

const STORAGE_KEY = "grappa-menu-locale";

export function isMenuLocale(value: string): value is MenuLocale {
  return value === "fr" || value === "en" || value === "de" || value === "it";
}

export function readStoredMenuLocale(): MenuLocale {
  if (typeof window === "undefined") return "fr";
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (value && isMenuLocale(value)) return value;
  } catch {
    // ignore
  }
  return "fr";
}

export function storeMenuLocale(locale: MenuLocale) {
  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // ignore
  }
}
