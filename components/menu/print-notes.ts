import type { MenuLocale } from "@/components/menu/i18n/locale";

export type PrintNoteLine = {
  kind: "supplement" | "comment";
  text: string;
  translations?: Partial<Record<Exclude<MenuLocale, "fr">, string>>;
};

export type PrintNote = {
  lines: PrintNoteLine[];
};

const BURRATA_SUPPLEMENT: PrintNoteLine = {
  kind: "supplement",
  text: "Supplément burrata  ·  7,50 €",
  translations: {
    en: "Burrata extra  ·  €7.50",
    de: "Extra Burrata  ·  7,50 €",
    it: "Supplemento burrata  ·  7,50 €",
  },
};

const PASTA_BASE_COMMENT: PrintNoteLine = {
  kind: "comment",
  text: "Toutes nos préparations ont une base de carotte, céleri et échalote.",
  translations: {
    en: "All our dishes start with a carrot, celery and shallot base.",
    de: "Alle Zubereitungen haben eine Basis aus Karotte, Sellerie und Schalotte.",
    it: "Tutte le preparazioni hanno una base di carota, sedano e scalogno.",
  },
};

/** Notes de pied de catégorie — plus tard éditables, pour l’instant figées. */
export const PRINT_NOTES: Record<string, PrintNote> = {
  "Nos Entrées": {
    lines: [BURRATA_SUPPLEMENT],
  },
  "Nos Viandes": {
    lines: [
      {
        kind: "comment",
        text: "Nos viandes et nos poissons sont accompagnés de pâtes, de petits légumes ou de salade.",
        translations: {
          en: "Our meats and fish are served with pasta, vegetables or salad.",
          de: "Unsere Fleisch- und Fischgerichte werden mit Pasta, Gemüse oder Salat serviert.",
          it: "Le nostre carni e i nostri pesci sono accompagnati da pasta, verdure o insalata.",
        },
      },
    ],
  },
  "Nos Pâtes": {
    lines: [BURRATA_SUPPLEMENT, PASTA_BASE_COMMENT],
  },
  "Pâtes fraîches": {
    lines: [BURRATA_SUPPLEMENT, PASTA_BASE_COMMENT],
  },
  "Nos Pizzas": {
    lines: [
      BURRATA_SUPPLEMENT,
      {
        kind: "supplement",
        text: "Boîte à emporter  ·  0,50 €",
        translations: {
          en: "Takeaway box  ·  €0.50",
          de: "Mitnahmebox  ·  0,50 €",
          it: "Confezione da asporto  ·  0,50 €",
        },
      },
    ],
  },
};

const FOOTER_DISH_NAMES = new Set(["supplément burrata"]);

export function isPrintFooterDish(name: string): boolean {
  return FOOTER_DISH_NAMES.has(name.trim().toLowerCase());
}

export function noteLineText(line: PrintNoteLine, locale: MenuLocale = "fr"): string {
  if (locale === "fr") return line.text;
  return line.translations?.[locale] ?? line.text;
}
