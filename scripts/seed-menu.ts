import { PrismaClient } from "@prisma/client";

import { DESSERT_CARD_CATEGORIES } from "./dessert-card-data";

const prisma = new PrismaClient();

type SeedItem = {
  name: string;
  description?: string;
  price: string;
  priceVerre?: string;
  priceQuart?: string;
  priceDemi?: string;
  priceBouteille?: string;
};

type SeedCategory = {
  name: string;
  items: SeedItem[];
};

const BURRATA: SeedItem = {
  name: "Supplément burrata",
  price: "7,50",
};

const CATEGORIES: SeedCategory[] = [
  {
    name: "Apéritifs",
    items: [
      { name: "Bière pression", description: "25 cl", price: "4,20" },
      { name: "Bière de saison", description: "25 cl", price: "4,90" },
      { name: "Picon Bière", description: "25 cl", price: "4,90" },
      { name: "Panaché", description: "25 cl", price: "4,10" },
      { name: "Ricard", description: "4 cl", price: "4,90" },
      { name: "Campari", description: "4 cl", price: "4,90" },
      { name: "Martini", description: "4 cl", price: "5,50" },
      { name: "Prosecco", description: "12 cl", price: "6,90" },
      { name: "Moscato", description: "12 cl", price: "6,90" },
      { name: "Kir Prosecco", description: "12 cl", price: "8,90" },
      { name: "Coupe Champagne", description: "12 cl", price: "12,50" },
      {
        name: "Spritz Aperol / Hugo / Campari",
        description: "16 cl",
        price: "9,80",
      },
      { name: "Spritz du Moment", description: "16 cl", price: "10,50" },
      { name: "Whiskey Selection", description: "4 cl", price: "7,70" },
    ],
  },
  {
    name: "Sans alcool",
    items: [
      { name: "Eau plate / gazeuse", description: "50 cl", price: "3,50" },
      { name: "Perrier", description: "33 cl", price: "3,80" },
      { name: "Limonade", description: "25 cl", price: "3,70" },
      { name: "Coca-Cola", description: "25 cl", price: "3,70" },
      { name: "Jus de fruit", description: "25 cl", price: "3,80" },
      { name: "Ice Tea", description: "25 cl", price: "3,80" },
      { name: "Diabolo", description: "25 cl", price: "3,70" },
      { name: "Bitter San Pellegrino", description: "20 cl", price: "3,90" },
      { name: "Schweppes", description: "25 cl", price: "3,70" },
      { name: "Orangina", description: "25 cl", price: "3,70" },
      { name: "Spritz sans alcool", description: "16 cl", price: "7,50" },
      { name: "Cocktail fruité", description: "25 cl", price: "7,50" },
    ],
  },
  {
    name: "Nos Entrées",
    items: [
      {
        name: "Carpaccio de bœuf",
        description: "Accompagné d’une pizza blanche",
        price: "16,20",
      },
      {
        name: "Salade tiède à la roquette et calamars",
        description:
          "Calamars, moules, roquette, tomates cerises, ail, herbes fraîches",
        price: "18,70",
      },
      {
        name: "Carpaccio de saumon gravlax",
        description: "Accompagné de toast",
        price: "16,70",
      },
      {
        name: "Bruschetta du moment",
        description: "Pour 2 personnes",
        price: "13,50",
      },
      {
        name: "Assiette de salaisons italiennes",
        description: "Pour 2 personnes — assortiment de charcuterie du moment",
        price: "17,20",
      },
      {
        name: "Salade d’antipasti",
        description:
          "Artichaut, tomates séchées, olives, roquette, tomates cerises, herbes fraîches",
        price: "14,50",
      },
      BURRATA,
    ],
  },
  {
    name: "Nos Viandes",
    items: [
      {
        name: "Saltimbocca à la Romaine",
        description:
          "Médaillons de veau, jambon cru, mozzarella, sauge. Servi avec pâtes, petits légumes ou salade.",
        price: "26,50",
      },
      {
        name: "Scaloppina à la Milanaise",
        description:
          "Médaillons de veau panés. Servi avec pâtes, petits légumes ou salade.",
        price: "24,50",
      },
      {
        name: "Scaloppina à la Pizzaïola",
        description:
          "Médaillons de veau, mozzarella, sauce tomate, olives, basilic et roquette. Servi avec pâtes, petits légumes ou salade.",
        price: "25,50",
      },
      {
        name: "Filet de bœuf 250g au Gorgonzola",
        description:
          "Pièce de bœuf, gorgonzola, crème, herbes fraîches. Servi avec pâtes, petits légumes ou salade.",
        price: "33,90",
      },
      {
        name: "Tagliata de bœuf, roquette & copeaux parmesan",
        description:
          "Pièce de bœuf, roquette, copeaux de parmesan. Servi avec pâtes, petits légumes ou salade.",
        price: "33,90",
      },
      {
        name: "Filet de bœuf 250g grillé",
        description: "Servi avec pâtes, petits légumes ou salade.",
        price: "30,90",
      },
    ],
  },
  {
    name: "Nos Pâtes",
    items: [
      {
        name: "Timballe de linguini aux fruits de mer",
        description:
          "Moules, calamars, gambas, ail, herbes fraîches, fumet de poissons et crustacés",
        price: "27,00",
      },
      {
        name: "Linguini al vongole",
        description:
          "Ail, herbes fraîches, palourdes, fumet de poissons et crustacés, vin blanc",
        price: "26,00",
      },
      {
        name: "Penne all’arrabiata",
        description:
          "Champignons, olives, ail, herbes fraîches, câpres, tomates, piments",
        price: "14,80",
      },
      {
        name: "Penne pollo & curry",
        description:
          "Émincé de poulet, champignons, curry, ail, crème, herbes fraîches",
        price: "16,20",
      },
      {
        name: "Gemelli alla Mediterranea",
        description:
          "Petits légumes, sauce tomate, ail, olives, câpres, herbes fraîches",
        price: "14,80",
      },
      {
        name: "Gemelli aux 3 fromages",
        description: "Assortiment de fromages, crème, herbes fraîches, pignons",
        price: "15,20",
      },
      {
        name: "Linguini al Napolitane",
        description: "Tomate, basilic, ail",
        price: "13,20",
      },
      {
        name: "Penne melanzane & salsiccia",
        description:
          "Petits légumes, sauce tomate, ail, saucisses pimentées, herbes fraîches",
        price: "16,80",
      },
      {
        name: "Linguini salmone & courgette",
        description:
          "Saumon frais, courgettes, crème, oignons, herbes fraîches, fumet de poissons et crustacés, vin blanc",
        price: "18,20",
      },
      {
        name: "Penne alla Matriciana",
        description: "Champignons, lardons, sauce tomate, crème, origan, ail",
        price: "15,80",
      },
    ],
  },
  {
    name: "Pâtes fraîches",
    items: [
      {
        name: "Panzerotti aux champignons",
        description: "Ravioli frais, champignon, ail, crème fraîche, herbes fraîches",
        price: "16,80",
      },
      {
        name: "Tortelloni alla Zingarra",
        description:
          "Chorizo, champignons, olives, ail, sauce tomate, crème et herbes fraîches",
        price: "16,80",
      },
      BURRATA,
    ],
  },
  {
    name: "Nos Pizzas",
    items: [
      {
        name: "Pizza Margherita",
        description: "Tomate San Matteo, Fior di Latte, basilic frais",
        price: "12,50",
      },
      {
        name: "Pizza méditerranéenne",
        description: "Tomate San Matteo, légumes grillés, olives Taggiasche, Fior di Latte",
        price: "14,50",
      },
      {
        name: "Pizza avec saumon frais",
        description:
          "Saumon, tomate San Matteo, crème fraîche, câpres, oignons, Fior di Latte",
        price: "17,50",
      },
      {
        name: "Pizza au carpaccio de bœuf, roquette & parmesan",
        description: "Carpaccio de bœuf, roquette, copeaux de parmesan, Fior di Latte",
        price: "16,70",
      },
      {
        name: "Pizza aux fruits de mer",
        description: "Selon arrivage — fruits de mer, tomate San Matteo, ail, Fior di Latte",
        price: "22,00",
      },
      {
        name: "Pizza Prosciutto & Funghi",
        description: "Jambon blanc fumé, champignons, Fior di Latte, tomate San Matteo",
        price: "15,20",
      },
      {
        name: "Pizza à la roquette & parmesan",
        description: "Roquette, copeaux de parmesan, Fior di Latte",
        price: "14,20",
      },
      {
        name: "Pizza chèvre, miel, roquette",
        description:
          "Tomate San Matteo, crème fraîche, chèvre, miel, roquette, pignons, ail, Fior di Latte",
        price: "16,20",
      },
      {
        name: "Pizza au jambon du moment",
        description: "Jambon cru, Fior di Latte, roquette, copeaux de parmesan",
        price: "18,20",
      },
      {
        name: "Pizza aux 4 fromages",
        description: "Fior di Latte, assortiment de fromages, tomate San Matteo, herbes fraîches",
        price: "16,20",
      },
      {
        name: "Pizza melanzane & salsiccia",
        description:
          "Légumes grillés, saucisses pimentées, tomate San Matteo, Fior di Latte",
        price: "16,50",
      },
      {
        name: "Pizza pollo curry & funghi",
        description:
          "Poulet, curry, champignons, tomate San Matteo, Fior di Latte, crème fraîche",
        price: "16,50",
      },
      { name: "Pizza blanche", price: "5,00" },
      BURRATA,
    ],
  },
  {
    name: "Vins blancs",
    items: [
      {
        name: "Frascati DOC — San Marco",
        description:
          "Trebbiano Toscano 15% · Malvasia di Candia 15% · Malvasia del Lazio 50% · Bellone 20%",
        price: "4,00",
        priceVerre: "4,00",
        priceQuart: "8,00",
        priceDemi: "16,00",
      },
      {
        name: "Lugana Morenabianca DOC — Mabis",
        description: "90% Trebbiano · 10% Chardonnay",
        price: "36,00",
        priceBouteille: "36,00",
      },
      {
        name: "Vernaccia San Gimignano DOC — Rocca delle Macie",
        description: "Vernaccia 100%",
        price: "5,00",
        priceVerre: "5,00",
        priceQuart: "10,00",
        priceDemi: "20,00",
        priceBouteille: "30,00",
      },
      {
        name: "Chardonnay Villa Angela IGT — Velenosi Ercole",
        description: "Chardonnay 100%",
        price: "6,00",
        priceVerre: "6,00",
        priceQuart: "12,00",
        priceDemi: "24,00",
        priceBouteille: "36,00",
      },
      {
        name: "Cirò blanc bio DOC — Santa Venere",
        description: "Greco 100%",
        price: "6,00",
        priceVerre: "6,00",
        priceQuart: "12,00",
        priceDemi: "24,00",
        priceBouteille: "36,00",
      },
      {
        name: "Pinot gris Collevento IGT — Antonutti",
        description: "Pinot gris 100%",
        price: "4,00",
        priceVerre: "4,00",
        priceQuart: "8,00",
        priceDemi: "16,00",
      },
    ],
  },
  {
    name: "Vins rosés",
    items: [
      {
        name: "Miravigna Terre di Chieti IGP — Casal Thaulero",
        description: "Montepulciano 100%",
        price: "5,00",
        priceVerre: "5,00",
        priceQuart: "10,00",
        priceDemi: "20,00",
        priceBouteille: "30,00",
      },
      {
        name: "Rosato Collevento IGT — Antonutti",
        description: "Merlot 50% · Cabernet Sauvignon 50%",
        price: "4,00",
        priceVerre: "4,00",
        priceQuart: "8,00",
        priceDemi: "16,00",
        priceBouteille: "24,00",
      },
      {
        name: "Bardolino Chiaretto DOC — Cantina Negrar",
        description: "Corvina 65% · Rondinella 30% · Molinara 5%",
        price: "3,00",
        priceVerre: "3,00",
        priceQuart: "6,00",
        priceDemi: "12,00",
      },
      {
        name: "Château Font du Broc AOC bio",
        description: "Syrah, Grenache, Mourvèdre, Rolle",
        price: "6,00",
        priceVerre: "6,00",
        priceQuart: "12,00",
        priceDemi: "24,00",
        priceBouteille: "36,00",
      },
    ],
  },
  {
    name: "Vins rouges",
    items: [
      {
        name: "Raudii IGT — Cantina Negrar",
        description: "Corvina 70% · Merlot 30%",
        price: "6,00",
        priceVerre: "6,00",
        priceQuart: "12,00",
        priceDemi: "24,00",
        priceBouteille: "36,00",
      },
      {
        name: "Lambrusco I Quercioli DOC — Medici",
        description: "Lambrusco Salamino 50% · Marani 50%",
        price: "3,50",
        priceVerre: "3,50",
        priceQuart: "7,00",
        priceDemi: "14,00",
        priceBouteille: "21,00",
      },
      {
        name: "Montepulciano Borgo DOC — Casal Thaulero",
        description: "Montepulciano 100%",
        price: "4,00",
        priceVerre: "4,00",
        priceQuart: "8,00",
        priceDemi: "16,00",
        priceBouteille: "24,00",
      },
      {
        name: "Lastone Rosso Veronese IGT — Negrar",
        description: "60% Corvina · 20% Corvinone · 10% Rondinella · 10% Merlot",
        price: "4,00",
        priceVerre: "4,00",
        priceQuart: "8,00",
        priceDemi: "16,00",
        priceBouteille: "24,00",
      },
      {
        name: "Primitivo Zolla IGP — Farnese",
        description: "Primitivo 50% · Merlot 50%",
        price: "5,50",
        priceVerre: "5,50",
        priceQuart: "11,00",
        priceDemi: "22,00",
        priceBouteille: "33,00",
      },
      {
        name: "Merlot de Sicile IGT — Mabis",
        description: "Merlot 100%",
        price: "4,50",
        priceVerre: "4,50",
        priceQuart: "9,00",
        priceDemi: "18,00",
        priceBouteille: "27,00",
      },
      {
        name: "Cirò rouge bio DOC — Santa Venere",
        description: "Gaglioppo 100%",
        price: "6,00",
        priceVerre: "6,00",
        priceQuart: "12,00",
        priceDemi: "24,00",
        priceBouteille: "36,00",
      },
      {
        name: "Barbera d’Asti DOC — Beni di Batasiolo",
        description: "Barbera d’Asti 100%",
        price: "6,00",
        priceVerre: "6,00",
        priceQuart: "12,00",
        priceDemi: "24,00",
        priceBouteille: "36,00",
      },
      {
        name: "Valpolicella bio DOC — Negrar",
        description: "Corvina 70% · Corvinone 15% · Rondinella 15%",
        price: "36,00",
        priceBouteille: "36,00",
      },
      {
        name: "Torrazzo Valtenesi DOC — Pratello",
        description: "Sangiovese, Groppello, Marzemino",
        price: "45,00",
        priceBouteille: "45,00",
      },
      {
        name: "Chianti Riserva DOC — Oro dei Sani",
        description: "Sangiovese 100%",
        price: "6,00",
        priceVerre: "6,00",
        priceQuart: "12,00",
        priceDemi: "24,00",
        priceBouteille: "36,00",
      },
    ],
  },
  {
    name: "Sélection cave",
    items: [
      {
        name: "Edizione 5 Autoctoni VDT — Fantini",
        description:
          "Montepulciano 33% · Primitivo 30% · Sangiovese 25% · Negroamaro 7% · Malvasia nera 5%",
        price: "89,00",
        priceBouteille: "89,00",
      },
      {
        name: "San Giorgio IGT — Lungarotti",
        description: "Cabernet Sauvignon 50% · Sangiovese 40% · Canaiolo 10%",
        price: "130,00",
        priceBouteille: "130,00",
      },
    ],
  },
  {
    name: "Spumante",
    items: [
      {
        name: "Moscato d’Asti Bosc d’la Rei DOC — Beni di Batasiolo",
        description: "Moscato Bianco 100%",
        price: "6,20",
        priceVerre: "6,20",
        priceQuart: "12,00",
        priceDemi: "24,00",
        priceBouteille: "36,00",
      },
      {
        name: "Prosecco Extra Dry bio — Terre dei Buth",
        description: "Glera 100%",
        price: "6,20",
        priceVerre: "6,20",
        priceQuart: "12,00",
        priceDemi: "24,00",
        priceBouteille: "36,00",
      },
    ],
  },
  ...DESSERT_CARD_CATEGORIES,
];

async function main() {
  await prisma.menuItem.deleteMany();
  await prisma.menuCategory.deleteMany();

  for (const [index, category] of CATEGORIES.entries()) {
    await prisma.menuCategory.create({
      data: {
        name: category.name,
        position: index + 1,
        menuType: "plats",
        items: {
          create: category.items.map((item, itemIndex) => ({
            name: item.name,
            description: item.description,
            price: item.price,
            priceVerre: item.priceVerre,
            priceQuart: item.priceQuart,
            priceDemi: item.priceDemi,
            priceBouteille: item.priceBouteille,
            position: itemIndex + 1,
          })),
        },
      },
    });
  }

  console.log(`Seed OK — ${CATEGORIES.length} catégories (carte plats 2026)`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
