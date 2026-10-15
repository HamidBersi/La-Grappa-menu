import type { MenuItemDto } from "@/components/menu/menu-types";

export const WINE_TIER_COLUMNS = [
  { key: "priceVerre", label: "Verre", volume: "12 cl" },
  { key: "priceQuart", label: "Quart", volume: "25 cl" },
  { key: "priceDemi", label: "Demi", volume: "50 cl" },
  { key: "priceBouteille", label: "Bouteille", volume: "75 cl" },
] as const;

export type WineTierKey = (typeof WINE_TIER_COLUMNS)[number]["key"];

export function hasWineTiers(item: Pick<MenuItemDto, WineTierKey>): boolean {
  return WINE_TIER_COLUMNS.some((column) => Boolean(item[column.key]));
}

export function formatEuro(price: string | null | undefined): string {
  if (!price) return "";
  const trimmed = price.trim();
  if (!trimmed) return "";
  if (!/^\d/.test(trimmed)) return trimmed;
  const value = Number.parseFloat(trimmed.replace(",", "."));
  if (!Number.isFinite(value)) return trimmed;
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

/** « Pinot Grigio (blanc) » → nom + style */
export function splitWineName(name: string): { title: string; style: string | null } {
  const match = name.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  if (!match) return { title: name, style: null };
  return { title: match[1], style: match[2] };
}
