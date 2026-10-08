export type MenuItemDto = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  isAvailable: boolean;
  position: number;
  categoryId: string;
  priceVerre?: string | null;
  priceQuart?: string | null;
  priceDemi?: string | null;
  priceBouteille?: string | null;
  emoji?: string | null;
};

export type MenuCategoryDto = {
  id: string;
  name: string;
  position: number;
  /** "salle" | "emporter" */
  menuType?: string;
  items: MenuItemDto[];
};

/** L’édition liste tout ; aperçu / print cachent seulement un `false` explicite. */
export function isListedOnMenu(item: Pick<MenuItemDto, "isAvailable">): boolean {
  return item.isAvailable !== false;
}
