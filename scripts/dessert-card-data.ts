export type DessertCardItem = {
  name: string;
  description?: string;
  price: string;
};

export type DessertCardCategory = {
  name: string;
  items: DessertCardItem[];
};

/** Carte A4 desserts / cafés / digestifs — 29 sept. 2026 */
export const DESSERT_CARD_CATEGORIES: DessertCardCategory[] = [
  {
    name: "Nos Desserts",
    items: [
      { name: "Tiramisù Maison", price: "7,90" },
      {
        name: "Moelleux Chocolat & Glace Vanille",
        description: "20 min. d’attente",
        price: "11,00",
      },
      { name: "Crème Brûlée", price: "7,80" },
      { name: "Café ou Chocolat Liégeois", price: "7,80" },
      { name: "Coupe Amarena", price: "7,80" },
      { name: "Dame Blanche", price: "7,80" },
      { name: "Délice du moment", price: "8,90" },
      { name: "Irish Coffee", price: "8,90" },
      {
        name: "Coupe de Glace au choix",
        description: "Vanille, Café, Chocolat et Pistache",
        price: "7,00",
      },
      {
        name: "Coupe de sorbet aux choix",
        description: "Citron, Framboise, Cassis, Mangue, Passion",
        price: "6,60",
      },
    ],
  },
  {
    name: "Cafés, Infusions",
    items: [
      { name: "Café expresso", price: "2,40" },
      { name: "Grand Café", price: "3,30" },
      { name: "Décaféiné", price: "2,30" },
      { name: "Cappuccino", price: "4,80" },
      { name: "Thé ou Infusion", price: "3,60" },
    ],
  },
  {
    name: "Digestifs",
    items: [
      { name: "Cognac XO", description: "4 cl", price: "9,50" },
      { name: "Whisky 16 ans d’âge", description: "4 cl", price: "9,50" },
      { name: "Grappa", description: "4 cl", price: "6,50" },
      { name: "Ramazzotti", description: "4 cl", price: "5,80" },
      { name: "Limoncello", description: "4 cl", price: "5,80" },
      { name: "Amaretto", description: "4 cl", price: "5,80" },
      {
        name: "Dégustation, 3 Grappa Réserve",
        description: "9 cl",
        price: "15,00",
      },
    ],
  },
];
