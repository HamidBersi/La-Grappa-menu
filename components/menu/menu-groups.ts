/**
 * Grouping UI seulement — pas de changement Prisma.
 * Noms = MenuCategory.name du seed La Grappa.
 */
export type MenuFamilyId =
  | "all"
  | "aperitivo"
  | "antipasti"
  | "piatti"
  | "pizzeria"
  | "dolci"
  | "dopo";

export type MenuFamily = {
  id: Exclude<MenuFamilyId, "all">;
  label: string;
  navLabel?: string;
  categoryNames: string[];
  chipLabelByName?: Record<string, string>;
  countNoun: string;
};

export const MENU_FAMILIES: MenuFamily[] = [
  {
    id: "aperitivo",
    label: "Boissons",
    categoryNames: [
      "Apéritifs",
      "Sans alcool",
      "Vins blancs",
      "Vins rosés",
      "Vins rouges",
      "Sélection cave",
      "Spumante",
    ],
    chipLabelByName: {
      "Sans alcool": "Sans alcool",
      "Vins blancs": "Blancs",
      "Vins rosés": "Rosés",
      "Vins rouges": "Rouges",
      "Sélection cave": "Cave",
    },
    countNoun: "boissons",
  },
  {
    id: "antipasti",
    label: "Entrées",
    categoryNames: ["Nos Entrées"],
    chipLabelByName: { "Nos Entrées": "Entrées" },
    countNoun: "plats",
  },
  {
    id: "piatti",
    label: "Plats",
    categoryNames: ["Nos Viandes", "Nos Pâtes", "Pâtes fraîches"],
    chipLabelByName: {
      "Nos Viandes": "Viandes",
      "Nos Pâtes": "Pâtes",
    },
    countNoun: "plats",
  },
  {
    id: "pizzeria",
    label: "Pizzas",
    categoryNames: ["Nos Pizzas"],
    chipLabelByName: { "Nos Pizzas": "Pizzas" },
    countNoun: "pizzas",
  },
  {
    id: "dolci",
    label: "Desserts",
    categoryNames: ["Nos Desserts"],
    chipLabelByName: { "Nos Desserts": "Desserts" },
    countNoun: "desserts",
  },
  {
    id: "dopo",
    label: "Cafés & digestifs",
    navLabel: "Cafés",
    categoryNames: ["Cafés, Infusions", "Digestifs"],
    chipLabelByName: {
      "Cafés, Infusions": "Cafés",
      Digestifs: "Digestifs",
    },
    countNoun: "boissons",
  },
];

export function familyForCategoryName(name: string): MenuFamily | undefined {
  return MENU_FAMILIES.find((family) => family.categoryNames.includes(name));
}

export function chipLabel(family: MenuFamily, categoryName: string): string {
  return family.chipLabelByName?.[categoryName] ?? categoryName;
}
