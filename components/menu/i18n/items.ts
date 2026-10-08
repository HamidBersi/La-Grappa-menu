import type { MenuLocale } from "@/components/menu/i18n/locale";

export const ITEM_TRANSLATIONS: Record<
  string,
  Partial<Record<Exclude<MenuLocale, "fr">, { name: string; description?: string | null }>>
> = {};
