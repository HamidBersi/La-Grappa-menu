import type { MenuLocale } from "@/components/menu/i18n/locale";

export const ITEM_TRANSLATIONS: Record<
  string,
  Partial<Record<Exclude<MenuLocale, "fr">, { name: string; description?: string | null }>>
> = {
  "Supplément burrata": {
    en: { name: "Burrata extra" },
    de: { name: "Extra Burrata" },
    it: { name: "Supplemento burrata" },
  },
  "Bière pression": {
    en: { name: "Draft beer", description: "25 cl" },
    de: { name: "Bier vom Fass", description: "25 cl" },
    it: { name: "Birra alla spina", description: "25 cl" },
  },
  "Bière de saison": {
    en: { name: "Seasonal beer", description: "25 cl" },
    de: { name: "Saisonbier", description: "25 cl" },
    it: { name: "Birra di stagione", description: "25 cl" },
  },
  "Picon Bière": {
    en: { name: "Picon Beer", description: "25 cl" },
    de: { name: "Picon Bier", description: "25 cl" },
    it: { name: "Picon Birra", description: "25 cl" },
  },
  "Panaché": {
    en: { name: "Shandy", description: "25 cl" },
    de: { name: "Radler", description: "25 cl" },
    it: { name: "Panaché", description: "25 cl" },
  },
  "Ricard": {
    en: { name: "Ricard", description: "4 cl" },
    de: { name: "Ricard", description: "4 cl" },
    it: { name: "Ricard", description: "4 cl" },
  },
  "Campari": {
    en: { name: "Campari", description: "4 cl" },
    de: { name: "Campari", description: "4 cl" },
    it: { name: "Campari", description: "4 cl" },
  },
  "Martini": {
    en: { name: "Martini", description: "4 cl" },
    de: { name: "Martini", description: "4 cl" },
    it: { name: "Martini", description: "4 cl" },
  },
  "Prosecco": {
    en: { name: "Prosecco", description: "12 cl" },
    de: { name: "Prosecco", description: "12 cl" },
    it: { name: "Prosecco", description: "12 cl" },
  },
  "Moscato": {
    en: { name: "Moscato", description: "12 cl" },
    de: { name: "Moscato", description: "12 cl" },
    it: { name: "Moscato", description: "12 cl" },
  },
  "Kir Prosecco": {
    en: { name: "Kir Prosecco", description: "12 cl" },
    de: { name: "Kir Prosecco", description: "12 cl" },
    it: { name: "Kir Prosecco", description: "12 cl" },
  },
  "Coupe Champagne": {
    en: { name: "Champagne coupe", description: "12 cl" },
    de: { name: "Champagner-Coupe", description: "12 cl" },
    it: { name: "Coppa Champagne", description: "12 cl" },
  },
  "Spritz Aperol / Hugo / Campari": {
    en: { name: "Spritz Aperol / Hugo / Campari", description: "16 cl" },
    de: { name: "Spritz Aperol / Hugo / Campari", description: "16 cl" },
    it: { name: "Spritz Aperol / Hugo / Campari", description: "16 cl" },
  },
  "Spritz du Moment": {
    en: { name: "Spritz of the day", description: "16 cl" },
    de: { name: "Spritz des Tages", description: "16 cl" },
    it: { name: "Spritz del momento", description: "16 cl" },
  },
  "Whiskey Selection": {
    en: { name: "Whiskey Selection", description: "4 cl" },
    de: { name: "Whiskey Selection", description: "4 cl" },
    it: { name: "Whiskey Selection", description: "4 cl" },
  },
  "Eau plate / gazeuse": {
    en: { name: "Still / sparkling water", description: "50 cl" },
    de: { name: "Stilles / Sprudelwasser", description: "50 cl" },
    it: { name: "Acqua naturale / frizzante", description: "50 cl" },
  },
  "Perrier": {
    en: { name: "Perrier", description: "33 cl" },
    de: { name: "Perrier", description: "33 cl" },
    it: { name: "Perrier", description: "33 cl" },
  },
  "Limonade": {
    en: { name: "Lemonade", description: "25 cl" },
    de: { name: "Limonade", description: "25 cl" },
    it: { name: "Limonata", description: "25 cl" },
  },
  "Coca-Cola": {
    en: { name: "Coca-Cola", description: "25 cl" },
    de: { name: "Coca-Cola", description: "25 cl" },
    it: { name: "Coca-Cola", description: "25 cl" },
  },
  "Jus de fruit": {
    en: { name: "Fruit juice", description: "25 cl" },
    de: { name: "Fruchtsaft", description: "25 cl" },
    it: { name: "Succo di frutta", description: "25 cl" },
  },
  "Ice Tea": {
    en: { name: "Ice Tea", description: "25 cl" },
    de: { name: "Ice Tea", description: "25 cl" },
    it: { name: "Ice Tea", description: "25 cl" },
  },
  "Diabolo": {
    en: { name: "Diabolo", description: "25 cl" },
    de: { name: "Diabolo", description: "25 cl" },
    it: { name: "Diabolo", description: "25 cl" },
  },
  "Bitter San Pellegrino": {
    en: { name: "Bitter San Pellegrino", description: "20 cl" },
    de: { name: "Bitter San Pellegrino", description: "20 cl" },
    it: { name: "Bitter San Pellegrino", description: "20 cl" },
  },
  "Schweppes": {
    en: { name: "Schweppes", description: "25 cl" },
    de: { name: "Schweppes", description: "25 cl" },
    it: { name: "Schweppes", description: "25 cl" },
  },
  "Orangina": {
    en: { name: "Orangina", description: "25 cl" },
    de: { name: "Orangina", description: "25 cl" },
    it: { name: "Orangina", description: "25 cl" },
  },
  "Spritz sans alcool": {
    en: { name: "Non-alcoholic spritz", description: "16 cl" },
    de: { name: "Alkoholfreier Spritz", description: "16 cl" },
    it: { name: "Spritz analcolico", description: "16 cl" },
  },
  "Cocktail fruité": {
    en: { name: "Fruit cocktail", description: "25 cl" },
    de: { name: "Fruchtcocktail", description: "25 cl" },
    it: { name: "Cocktail alla frutta", description: "25 cl" },
  },
  "Carpaccio de bœuf": {
    en: { name: "Beef carpaccio", description: "Served with a white pizza" },
    de: { name: "Rinder-Carpaccio", description: "Serviert mit einer weißen Pizza" },
    it: { name: "Carpaccio di manzo", description: "Accompagnato da una pizza bianca" },
  },
  "Salade tiède à la roquette et calamars": {
    en: { name: "Warm rocket and squid salad", description: "Squid, mussels, rocket, cherry tomatoes, garlic, fresh herbs" },
    de: { name: "Warmer Rucola- und Tintenfischsalat", description: "Tintenfisch, Muscheln, Rucola, Kirschtomaten, Knoblauch, frische Kräuter" },
    it: { name: "Insalata tiepida di rucola e calamari", description: "Calamari, cozze, rucola, pomodorini, aglio, erbe fresche" },
  },
  "Carpaccio de saumon gravlax": {
    en: { name: "Gravlax salmon carpaccio", description: "Served with toast" },
    de: { name: "Gravlax-Lachs-Carpaccio", description: "Serviert mit Toast" },
    it: { name: "Carpaccio di salmone gravlax", description: "Accompagnato da toast" },
  },
  "Bruschetta du moment": {
    en: { name: "Bruschetta of the day", description: "For 2 people" },
    de: { name: "Bruschetta des Tages", description: "Für 2 Personen" },
    it: { name: "Bruschetta del momento", description: "Per 2 persone" },
  },
  "Assiette de salaisons italiennes": {
    en: { name: "Italian cured meats platter", description: "For 2 people — assortment of cured meats of the day" },
    de: { name: "Italienische Wurstwarenplatte", description: "Für 2 Personen — Auswahl an Wurstwaren des Tages" },
    it: { name: "Piatto di salumi italiani", description: "Per 2 persone — assortimento di salumi del momento" },
  },
  "Salade d’antipasti": {
    en: { name: "Antipasti salad", description: "Artichoke, sun-dried tomatoes, olives, rocket, cherry tomatoes, fresh herbs" },
    de: { name: "Antipasti-Salat", description: "Artischocke, getrocknete Tomaten, Oliven, Rucola, Kirschtomaten, frische Kräuter" },
    it: { name: "Insalata di antipasti", description: "Carciofi, pomodori secchi, olive, rucola, pomodorini, erbe fresche" },
  },
  "Saltimbocca à la Romaine": {
    en: { name: "Saltimbocca alla Romana", description: "Veal medallions, cured ham, mozzarella, sage. Served with pasta, vegetables or salad." },
    de: { name: "Saltimbocca alla Romana", description: "Kalbsmedaillons, Rohschinken, Mozzarella, Salbei. Serviert mit Pasta, Gemüse oder Salat." },
    it: { name: "Saltimbocca alla Romana", description: "Medaglioni di vitello, prosciutto crudo, mozzarella, salvia. Servito con pasta, verdure o insalata." },
  },
  "Scaloppina à la Milanaise": {
    en: { name: "Scaloppina Milanese", description: "Breaded veal medallions. Served with pasta, vegetables or salad." },
    de: { name: "Scaloppina alla Milanese", description: "Paniert Kalbsmedaillons. Serviert mit Pasta, Gemüse oder Salat." },
    it: { name: "Scaloppina alla Milanese", description: "Medaglioni di vitello impanati. Servito con pasta, verdure o insalata." },
  },
  "Scaloppina à la Pizzaïola": {
    en: { name: "Scaloppina Pizzaïola", description: "Veal medallions, mozzarella, tomato sauce, olives, basil and rocket. Served with pasta, vegetables or salad." },
    de: { name: "Scaloppina Pizzaïola", description: "Kalbsmedaillons, Mozzarella, Tomatensauce, Oliven, Basilikum und Rucola. Serviert mit Pasta, Gemüse oder Salat." },
    it: { name: "Scaloppina alla pizzaiola", description: "Medaglioni di vitello, mozzarella, salsa di pomodoro, olive, basilico e rucola. Servito con pasta, verdure o insalata." },
  },
  "Filet de bœuf 250g au Gorgonzola": {
    en: { name: "Beef fillet 250g with Gorgonzola", description: "Beef, gorgonzola, cream, fresh herbs. Served with pasta, vegetables or salad." },
    de: { name: "Rinderfilet 250g mit Gorgonzola", description: "Rindfleisch, Gorgonzola, Sahne, frische Kräuter. Serviert mit Pasta, Gemüse oder Salat." },
    it: { name: "Filetto di manzo 250g al Gorgonzola", description: "Manzo, gorgonzola, panna, erbe fresche. Servito con pasta, verdure o insalata." },
  },
  "Tagliata de bœuf, roquette & copeaux parmesan": {
    en: { name: "Sliced beef, rocket & Parmesan shavings", description: "Beef, rocket, Parmesan shavings. Served with pasta, vegetables or salad." },
    de: { name: "Tagliata vom Rind, Rucola & Parmesan", description: "Rindfleisch, Rucola, Parmesanspäne. Serviert mit Pasta, Gemüse oder Salat." },
    it: { name: "Tagliata di manzo, rucola e scaglie di parmigiano", description: "Manzo, rucola, scaglie di parmigiano. Servito con pasta, verdure o insalata." },
  },
  "Filet de bœuf 250g grillé": {
    en: { name: "Grilled beef fillet 250g", description: "Served with pasta, vegetables or salad." },
    de: { name: "Gegrilltes Rinderfilet 250g", description: "Serviert mit Pasta, Gemüse oder Salat." },
    it: { name: "Filetto di manzo 250g alla griglia", description: "Servito con pasta, verdure o insalata." },
  },
  "Timballe de linguini aux fruits de mer": {
    en: { name: "Seafood linguine timbale", description: "Mussels, squid, prawns, garlic, fresh herbs, fish and shellfish stock" },
    de: { name: "Linguine-Timballo mit Meeresfrüchten", description: "Muscheln, Tintenfisch, Garnelen, Knoblauch, frische Kräuter, Fisch- und Krustentierfond" },
    it: { name: "Timballo di linguine ai frutti di mare", description: "Cozze, calamari, gamberi, aglio, erbe fresche, fumetto di pesce e crostacei" },
  },
  "Linguini al vongole": {
    en: { name: "Linguine alle vongole", description: "Garlic, fresh herbs, clams, fish and shellfish stock, white wine" },
    de: { name: "Linguine alle vongole", description: "Knoblauch, frische Kräuter, Venusmuscheln, Fisch- und Krustentierfond, Weißwein" },
    it: { name: "Linguine alle vongole", description: "Aglio, erbe fresche, vongole, fumetto di pesce e crostacei, vino bianco" },
  },
  "Penne all’arrabiata": {
    en: { name: "Penne all’arrabbiata", description: "Mushrooms, olives, garlic, fresh herbs, capers, tomatoes, chilli" },
    de: { name: "Penne all’arrabbiata", description: "Pilze, Oliven, Knoblauch, frische Kräuter, Kapern, Tomaten, Chili" },
    it: { name: "Penne all’arrabbiata", description: "Funghi, olive, aglio, erbe fresche, capperi, pomodori, peperoncino" },
  },
  "Penne pollo & curry": {
    en: { name: "Penne chicken & curry", description: "Sliced chicken, mushrooms, curry, garlic, cream, fresh herbs" },
    de: { name: "Penne Hähnchen & Curry", description: "Hähnchenstreifen, Pilze, Curry, Knoblauch, Sahne, frische Kräuter" },
    it: { name: "Penne pollo & curry", description: "Pollo a straccetti, funghi, curry, aglio, panna, erbe fresche" },
  },
  "Gemelli alla Mediterranea": {
    en: { name: "Gemelli alla Mediterranea", description: "Vegetables, tomato sauce, garlic, olives, capers, fresh herbs" },
    de: { name: "Gemelli alla Mediterranea", description: "Gemüse, Tomatensauce, Knoblauch, Oliven, Kapern, frische Kräuter" },
    it: { name: "Gemelli alla Mediterranea", description: "Verdure, salsa di pomodoro, aglio, olive, capperi, erbe fresche" },
  },
  "Gemelli aux 3 fromages": {
    en: { name: "Gemelli with three cheeses", description: "Assorted cheeses, cream, fresh herbs, pine nuts" },
    de: { name: "Gemelli mit 3 Käsesorten", description: "Käseauswahl, Sahne, frische Kräuter, Pinienkerne" },
    it: { name: "Gemelli ai 3 formaggi", description: "Assortimento di formaggi, panna, erbe fresche, pinoli" },
  },
  "Linguini al Napolitane": {
    en: { name: "Linguine Napoletana", description: "Tomato, basil, garlic" },
    de: { name: "Linguine Napoletana", description: "Tomate, Basilikum, Knoblauch" },
    it: { name: "Linguine al Napoletano", description: "Pomodoro, basilico, aglio" },
  },
  "Penne melanzane & salsiccia": {
    en: { name: "Penne aubergine & sausage", description: "Vegetables, tomato sauce, garlic, spicy sausages, fresh herbs" },
    de: { name: "Penne Aubergine & Salsiccia", description: "Gemüse, Tomatensauce, Knoblauch, scharfe Würstchen, frische Kräuter" },
    it: { name: "Penne melanzane & salsiccia", description: "Verdure, salsa di pomodoro, aglio, salsicce piccanti, erbe fresche" },
  },
  "Linguini salmone & courgette": {
    en: { name: "Linguine salmon & courgette", description: "Fresh salmon, courgettes, cream, onions, fresh herbs, fish and shellfish stock, white wine" },
    de: { name: "Linguine Lachs & Zucchini", description: "Frischer Lachs, Zucchini, Sahne, Zwiebeln, frische Kräuter, Fisch- und Krustentierfond, Weißwein" },
    it: { name: "Linguine salmone & zucchina", description: "Salmone fresco, zucchine, panna, cipolle, erbe fresche, fumetto di pesce e crostacei, vino bianco" },
  },
  "Penne alla Matriciana": {
    en: { name: "Penne alla Matriciana", description: "Mushrooms, bacon, tomato sauce, cream, oregano, garlic" },
    de: { name: "Penne alla Matriciana", description: "Pilze, Speck, Tomatensauce, Sahne, Oregano, Knoblauch" },
    it: { name: "Penne alla Matriciana", description: "Funghi, pancetta, salsa di pomodoro, panna, origano, aglio" },
  },
  "Panzerotti aux champignons": {
    en: { name: "Panzerotti with mushrooms", description: "Fresh ravioli, mushroom, garlic, crème fraîche, fresh herbs" },
    de: { name: "Panzerotti mit Pilzen", description: "Frische Ravioli, Pilze, Knoblauch, Crème fraîche, frische Kräuter" },
    it: { name: "Panzerotti ai funghi", description: "Ravioli freschi, funghi, aglio, panna fresca, erbe fresche" },
  },
  "Tortelloni alla Zingarra": {
    en: { name: "Tortelloni alla Zingara", description: "Chorizo, mushrooms, olives, garlic, tomato sauce, cream and fresh herbs" },
    de: { name: "Tortelloni alla Zingara", description: "Chorizo, Pilze, Oliven, Knoblauch, Tomatensauce, Sahne und frische Kräuter" },
    it: { name: "Tortelloni alla Zingara", description: "Chorizo, funghi, olive, aglio, salsa di pomodoro, panna ed erbe fresche" },
  },
  "Pizza Margherita": {
    en: { name: "Pizza Margherita", description: "San Matteo tomato, Fior di Latte, fresh basil" },
    de: { name: "Pizza Margherita", description: "San-Matteo-Tomate, Fior di Latte, frisches Basilikum" },
    it: { name: "Pizza Margherita", description: "Pomodoro San Matteo, Fior di Latte, basilico fresco" },
  },
  "Pizza méditerranéenne": {
    en: { name: "Mediterranean pizza", description: "San Matteo tomato, grilled vegetables, Taggiasche olives, Fior di Latte" },
    de: { name: "Mediterrane Pizza", description: "San-Matteo-Tomate, Grillgemüse, Taggiasca-Oliven, Fior di Latte" },
    it: { name: "Pizza mediterranea", description: "Pomodoro San Matteo, verdure grigliate, olive Taggiasche, Fior di Latte" },
  },
  "Pizza avec saumon frais": {
    en: { name: "Pizza with fresh salmon", description: "Salmon, San Matteo tomato, crème fraîche, capers, onions, Fior di Latte" },
    de: { name: "Pizza mit frischem Lachs", description: "Lachs, San-Matteo-Tomate, Crème fraîche, Kapern, Zwiebeln, Fior di Latte" },
    it: { name: "Pizza con salmone fresco", description: "Salmone, pomodoro San Matteo, panna fresca, capperi, cipolle, Fior di Latte" },
  },
  "Pizza au carpaccio de bœuf, roquette & parmesan": {
    en: { name: "Pizza with beef carpaccio, rocket & Parmesan", description: "Beef carpaccio, rocket, Parmesan shavings, Fior di Latte" },
    de: { name: "Pizza mit Rinder-Carpaccio, Rucola & Parmesan", description: "Rinder-Carpaccio, Rucola, Parmesanspäne, Fior di Latte" },
    it: { name: "Pizza con carpaccio di manzo, rucola e parmigiano", description: "Carpaccio di manzo, rucola, scaglie di parmigiano, Fior di Latte" },
  },
  "Pizza aux fruits de mer": {
    en: { name: "Seafood pizza", description: "Subject to arrival — seafood, San Matteo tomato, garlic, Fior di Latte" },
    de: { name: "Meeresfrüchte-Pizza", description: "Je nach Anlieferung — Meeresfrüchte, San-Matteo-Tomate, Knoblauch, Fior di Latte" },
    it: { name: "Pizza ai frutti di mare", description: "Secondo arrivo — frutti di mare, pomodoro San Matteo, aglio, Fior di Latte" },
  },
  "Pizza Prosciutto & Funghi": {
    en: { name: "Pizza Prosciutto & Funghi", description: "Smoked cooked ham, mushrooms, Fior di Latte, San Matteo tomato" },
    de: { name: "Pizza Prosciutto & Funghi", description: "Geräucherter Kochschinken, Pilze, Fior di Latte, San-Matteo-Tomate" },
    it: { name: "Pizza Prosciutto & Funghi", description: "Prosciutto cotto affumicato, funghi, Fior di Latte, pomodoro San Matteo" },
  },
  "Pizza à la roquette & parmesan": {
    en: { name: "Pizza with rocket & Parmesan", description: "Rocket, Parmesan shavings, Fior di Latte" },
    de: { name: "Pizza mit Rucola & Parmesan", description: "Rucola, Parmesanspäne, Fior di Latte" },
    it: { name: "Pizza con rucola e parmigiano", description: "Rucola, scaglie di parmigiano, Fior di Latte" },
  },
  "Pizza chèvre, miel, roquette": {
    en: { name: "Pizza goat cheese, honey, rocket", description: "San Matteo tomato, crème fraîche, goat cheese, honey, rocket, pine nuts, garlic, Fior di Latte" },
    de: { name: "Pizza Ziegenkäse, Honig, Rucola", description: "San-Matteo-Tomate, Crème fraîche, Ziegenkäse, Honig, Rucola, Pinienkerne, Knoblauch, Fior di Latte" },
    it: { name: "Pizza caprino, miele, rucola", description: "Pomodoro San Matteo, panna fresca, caprino, miele, rucola, pinoli, aglio, Fior di Latte" },
  },
  "Pizza au jambon du moment": {
    en: { name: "Pizza with cured ham of the day", description: "Cured ham, Fior di Latte, rocket, Parmesan shavings" },
    de: { name: "Pizza mit Schinken des Tages", description: "Rohschinken, Fior di Latte, Rucola, Parmesanspäne" },
    it: { name: "Pizza con prosciutto del momento", description: "Prosciutto crudo, Fior di Latte, rucola, scaglie di parmigiano" },
  },
  "Pizza aux 4 fromages": {
    en: { name: "Four-cheese pizza", description: "Fior di Latte, assorted cheeses, San Matteo tomato, fresh herbs" },
    de: { name: "Pizza Quattro Formaggi", description: "Fior di Latte, Käseauswahl, San-Matteo-Tomate, frische Kräuter" },
    it: { name: "Pizza ai 4 formaggi", description: "Fior di Latte, assortimento di formaggi, pomodoro San Matteo, erbe fresche" },
  },
  "Pizza melanzane & salsiccia": {
    en: { name: "Pizza aubergine & sausage", description: "Grilled vegetables, spicy sausages, San Matteo tomato, Fior di Latte" },
    de: { name: "Pizza Aubergine & Salsiccia", description: "Grillgemüse, scharfe Würstchen, San-Matteo-Tomate, Fior di Latte" },
    it: { name: "Pizza melanzane & salsiccia", description: "Verdure grigliate, salsicce piccanti, pomodoro San Matteo, Fior di Latte" },
  },
  "Pizza pollo curry & funghi": {
    en: { name: "Pizza chicken curry & mushrooms", description: "Chicken, curry, mushrooms, San Matteo tomato, Fior di Latte, crème fraîche" },
    de: { name: "Pizza Hähnchen-Curry & Pilze", description: "Hähnchen, Curry, Pilze, San-Matteo-Tomate, Fior di Latte, Crème fraîche" },
    it: { name: "Pizza pollo curry & funghi", description: "Pollo, curry, funghi, pomodoro San Matteo, Fior di Latte, panna fresca" },
  },
  "Pizza blanche": {
    en: { name: "White pizza" },
    de: { name: "Weiße Pizza" },
    it: { name: "Pizza bianca" },
  },
  "Cirò blanc bio DOC — Santa Venere": {
    en: { name: "Cirò white organic DOC — Santa Venere", description: "Greco 100%" },
    de: { name: "Cirò weiß bio DOC — Santa Venere", description: "Greco 100%" },
    it: { name: "Cirò bianco bio DOC — Santa Venere", description: "Greco 100%" },
  },
  "Pinot gris Collevento IGT — Antonutti": {
    en: { name: "Pinot Grigio Collevento IGT — Antonutti", description: "Pinot Grigio 100%" },
    de: { name: "Pinot Grigio Collevento IGT — Antonutti", description: "Pinot Grigio 100%" },
    it: { name: "Pinot grigio Collevento IGT — Antonutti", description: "Pinot grigio 100%" },
  },
  "Château Font du Broc AOC bio": {
    en: { name: "Château Font du Broc AOC organic", description: "Syrah, Grenache, Mourvèdre, Rolle" },
    de: { name: "Château Font du Broc AOC bio", description: "Syrah, Grenache, Mourvèdre, Rolle" },
    it: { name: "Château Font du Broc AOC bio", description: "Syrah, Grenache, Mourvèdre, Rolle" },
  },
  "Merlot de Sicile IGT — Mabis": {
    en: { name: "Sicilian Merlot IGT — Mabis", description: "Merlot 100%" },
    de: { name: "Sizilianischer Merlot IGT — Mabis", description: "Merlot 100%" },
    it: { name: "Merlot di Sicilia IGT — Mabis", description: "Merlot 100%" },
  },
  "Cirò rouge bio DOC — Santa Venere": {
    en: { name: "Cirò red organic DOC — Santa Venere", description: "Gaglioppo 100%" },
    de: { name: "Cirò rot bio DOC — Santa Venere", description: "Gaglioppo 100%" },
    it: { name: "Cirò rosso bio DOC — Santa Venere", description: "Gaglioppo 100%" },
  },
  "Valpolicella bio DOC — Negrar": {
    en: { name: "Valpolicella organic DOC — Negrar", description: "Corvina 70% · Corvinone 15% · Rondinella 15%" },
    de: { name: "Valpolicella bio DOC — Negrar", description: "Corvina 70% · Corvinone 15% · Rondinella 15%" },
    it: { name: "Valpolicella bio DOC — Negrar", description: "Corvina 70% · Corvinone 15% · Rondinella 15%" },
  },
  "Prosecco Extra Dry bio — Terre dei Buth": {
    en: { name: "Prosecco Extra Dry organic — Terre dei Buth", description: "Glera 100%" },
    de: { name: "Prosecco Extra Dry bio — Terre dei Buth", description: "Glera 100%" },
    it: { name: "Prosecco Extra Dry bio — Terre dei Buth", description: "Glera 100%" },
  },
  "Tiramisù Maison": {
    en: { name: "Homemade tiramisù" },
    de: { name: "Hausgemachtes Tiramisù" },
    it: { name: "Tiramisù della casa" },
  },
  "Moelleux Chocolat & Glace Vanille": {
    en: { name: "Chocolate fondant & vanilla ice cream", description: "20 min. waiting time" },
    de: { name: "Schokoladenfondant & Vanilleeis", description: "20 Min. Wartezeit" },
    it: { name: "Tortino al cioccolato & gelato alla vaniglia", description: "20 min. di attesa" },
  },
  "Crème Brûlée": {
    en: { name: "Crème brûlée" },
    de: { name: "Crème brûlée" },
    it: { name: "Crème brûlée" },
  },
  "Café ou Chocolat Liégeois": {
    en: { name: "Coffee or chocolate Liégeois" },
    de: { name: "Kaffee- oder Schokoladen-Liégeois" },
    it: { name: "Caffè o cioccolato Liégeois" },
  },
  "Coupe Amarena": {
    en: { name: "Amarena sundae" },
    de: { name: "Amarena-Becher" },
    it: { name: "Coppa Amarena" },
  },
  "Dame Blanche": {
    en: { name: "Dame Blanche" },
    de: { name: "Dame Blanche" },
    it: { name: "Dame Blanche" },
  },
  "Délice du moment": {
    en: { name: "Delight of the day" },
    de: { name: "Delikatesse des Tages" },
    it: { name: "Delizia del momento" },
  },
  "Irish Coffee": {
    en: { name: "Irish Coffee" },
    de: { name: "Irish Coffee" },
    it: { name: "Irish Coffee" },
  },
  "Coupe de Glace au choix": {
    en: { name: "Ice cream sundae of your choice", description: "Vanilla, coffee, chocolate and pistachio" },
    de: { name: "Eisbecher nach Wahl", description: "Vanille, Kaffee, Schokolade und Pistazie" },
    it: { name: "Coppa di gelato a scelta", description: "Vaniglia, caffè, cioccolato e pistacchio" },
  },
  "Coupe de sorbet aux choix": {
    en: { name: "Sorbet sundae of your choice", description: "Lemon, raspberry, blackcurrant, mango, passion fruit" },
    de: { name: "Sorbetbecher nach Wahl", description: "Zitrone, Himbeere, Johannisbeere, Mango, Maracuja" },
    it: { name: "Coppa di sorbetto a scelta", description: "Limone, lampone, ribes, mango, passion fruit" },
  },
  "Café expresso": {
    en: { name: "Espresso" },
    de: { name: "Espresso" },
    it: { name: "Caffè espresso" },
  },
  "Grand Café": {
    en: { name: "Large coffee" },
    de: { name: "Großer Kaffee" },
    it: { name: "Caffè lungo" },
  },
  "Décaféiné": {
    en: { name: "Decaf" },
    de: { name: "Entkoffeiniert" },
    it: { name: "Decaffeinato" },
  },
  "Cappuccino": {
    en: { name: "Cappuccino" },
    de: { name: "Cappuccino" },
    it: { name: "Cappuccino" },
  },
  "Thé ou Infusion": {
    en: { name: "Tea or herbal infusion" },
    de: { name: "Tee oder Kräutertee" },
    it: { name: "Tè o tisana" },
  },
  "Cognac XO": {
    en: { name: "Cognac XO", description: "4 cl" },
    de: { name: "Cognac XO", description: "4 cl" },
    it: { name: "Cognac XO", description: "4 cl" },
  },
  "Whisky 16 ans d’âge": {
    en: { name: "16-year-old whisky", description: "4 cl" },
    de: { name: "Whisky 16 Jahre", description: "4 cl" },
    it: { name: "Whisky 16 anni", description: "4 cl" },
  },
  "Grappa": {
    en: { name: "Grappa", description: "4 cl" },
    de: { name: "Grappa", description: "4 cl" },
    it: { name: "Grappa", description: "4 cl" },
  },
  "Ramazzotti": {
    en: { name: "Ramazzotti", description: "4 cl" },
    de: { name: "Ramazzotti", description: "4 cl" },
    it: { name: "Ramazzotti", description: "4 cl" },
  },
  "Limoncello": {
    en: { name: "Limoncello", description: "4 cl" },
    de: { name: "Limoncello", description: "4 cl" },
    it: { name: "Limoncello", description: "4 cl" },
  },
  "Amaretto": {
    en: { name: "Amaretto", description: "4 cl" },
    de: { name: "Amaretto", description: "4 cl" },
    it: { name: "Amaretto", description: "4 cl" },
  },
  "Dégustation, 3 Grappa Réserve": {
    en: { name: "Tasting: 3 reserve grappas", description: "9 cl" },
    de: { name: "Verkostung: 3 Grappa Riserva", description: "9 cl" },
    it: { name: "Degustazione, 3 Grappa Riserva", description: "9 cl" },
  },
  "Frascati DOC — San Marco": {
    en: { name: "Frascati DOC — San Marco", description: "Trebbiano Toscano 15% · Malvasia di Candia 15% · Malvasia del Lazio 50% · Bellone 20%" },
    de: { name: "Frascati DOC — San Marco", description: "Trebbiano Toscano 15% · Malvasia di Candia 15% · Malvasia del Lazio 50% · Bellone 20%" },
    it: { name: "Frascati DOC — San Marco", description: "Trebbiano Toscano 15% · Malvasia di Candia 15% · Malvasia del Lazio 50% · Bellone 20%" },
  },
  "Lugana Morenabianca DOC — Mabis": {
    en: { name: "Lugana Morenabianca DOC — Mabis", description: "90% Trebbiano · 10% Chardonnay" },
    de: { name: "Lugana Morenabianca DOC — Mabis", description: "90% Trebbiano · 10% Chardonnay" },
    it: { name: "Lugana Morenabianca DOC — Mabis", description: "90% Trebbiano · 10% Chardonnay" },
  },
  "Vernaccia San Gimignano DOC — Rocca delle Macie": {
    en: { name: "Vernaccia San Gimignano DOC — Rocca delle Macie", description: "Vernaccia 100%" },
    de: { name: "Vernaccia San Gimignano DOC — Rocca delle Macie", description: "Vernaccia 100%" },
    it: { name: "Vernaccia San Gimignano DOC — Rocca delle Macie", description: "Vernaccia 100%" },
  },
  "Chardonnay Villa Angela IGT — Velenosi Ercole": {
    en: { name: "Chardonnay Villa Angela IGT — Velenosi Ercole", description: "Chardonnay 100%" },
    de: { name: "Chardonnay Villa Angela IGT — Velenosi Ercole", description: "Chardonnay 100%" },
    it: { name: "Chardonnay Villa Angela IGT — Velenosi Ercole", description: "Chardonnay 100%" },
  },
  "Miravigna Terre di Chieti IGP — Casal Thaulero": {
    en: { name: "Miravigna Terre di Chieti IGP — Casal Thaulero", description: "Montepulciano 100%" },
    de: { name: "Miravigna Terre di Chieti IGP — Casal Thaulero", description: "Montepulciano 100%" },
    it: { name: "Miravigna Terre di Chieti IGP — Casal Thaulero", description: "Montepulciano 100%" },
  },
  "Rosato Collevento IGT — Antonutti": {
    en: { name: "Rosato Collevento IGT — Antonutti", description: "Merlot 50% · Cabernet Sauvignon 50%" },
    de: { name: "Rosato Collevento IGT — Antonutti", description: "Merlot 50% · Cabernet Sauvignon 50%" },
    it: { name: "Rosato Collevento IGT — Antonutti", description: "Merlot 50% · Cabernet Sauvignon 50%" },
  },
  "Bardolino Chiaretto DOC — Cantina Negrar": {
    en: { name: "Bardolino Chiaretto DOC — Cantina Negrar", description: "Corvina 65% · Rondinella 30% · Molinara 5%" },
    de: { name: "Bardolino Chiaretto DOC — Cantina Negrar", description: "Corvina 65% · Rondinella 30% · Molinara 5%" },
    it: { name: "Bardolino Chiaretto DOC — Cantina Negrar", description: "Corvina 65% · Rondinella 30% · Molinara 5%" },
  },
  "Raudii IGT — Cantina Negrar": {
    en: { name: "Raudii IGT — Cantina Negrar", description: "Corvina 70% · Merlot 30%" },
    de: { name: "Raudii IGT — Cantina Negrar", description: "Corvina 70% · Merlot 30%" },
    it: { name: "Raudii IGT — Cantina Negrar", description: "Corvina 70% · Merlot 30%" },
  },
  "Lambrusco I Quercioli DOC — Medici": {
    en: { name: "Lambrusco I Quercioli DOC — Medici", description: "Lambrusco Salamino 50% · Marani 50%" },
    de: { name: "Lambrusco I Quercioli DOC — Medici", description: "Lambrusco Salamino 50% · Marani 50%" },
    it: { name: "Lambrusco I Quercioli DOC — Medici", description: "Lambrusco Salamino 50% · Marani 50%" },
  },
  "Montepulciano Borgo DOC — Casal Thaulero": {
    en: { name: "Montepulciano Borgo DOC — Casal Thaulero", description: "Montepulciano 100%" },
    de: { name: "Montepulciano Borgo DOC — Casal Thaulero", description: "Montepulciano 100%" },
    it: { name: "Montepulciano Borgo DOC — Casal Thaulero", description: "Montepulciano 100%" },
  },
  "Lastone Rosso Veronese IGT — Negrar": {
    en: { name: "Lastone Rosso Veronese IGT — Negrar", description: "60% Corvina · 20% Corvinone · 10% Rondinella · 10% Merlot" },
    de: { name: "Lastone Rosso Veronese IGT — Negrar", description: "60% Corvina · 20% Corvinone · 10% Rondinella · 10% Merlot" },
    it: { name: "Lastone Rosso Veronese IGT — Negrar", description: "60% Corvina · 20% Corvinone · 10% Rondinella · 10% Merlot" },
  },
  "Primitivo Zolla IGP — Farnese": {
    en: { name: "Primitivo Zolla IGP — Farnese", description: "Primitivo 50% · Merlot 50%" },
    de: { name: "Primitivo Zolla IGP — Farnese", description: "Primitivo 50% · Merlot 50%" },
    it: { name: "Primitivo Zolla IGP — Farnese", description: "Primitivo 50% · Merlot 50%" },
  },
  "Barbera d’Asti DOC — Beni di Batasiolo": {
    en: { name: "Barbera d’Asti DOC — Beni di Batasiolo", description: "Barbera d’Asti 100%" },
    de: { name: "Barbera d’Asti DOC — Beni di Batasiolo", description: "Barbera d’Asti 100%" },
    it: { name: "Barbera d’Asti DOC — Beni di Batasiolo", description: "Barbera d’Asti 100%" },
  },
  "Torrazzo Valtenesi DOC — Pratello": {
    en: { name: "Torrazzo Valtenesi DOC — Pratello", description: "Sangiovese, Groppello, Marzemino" },
    de: { name: "Torrazzo Valtenesi DOC — Pratello", description: "Sangiovese, Groppello, Marzemino" },
    it: { name: "Torrazzo Valtenesi DOC — Pratello", description: "Sangiovese, Groppello, Marzemino" },
  },
  "Chianti Riserva DOC — Oro dei Sani": {
    en: { name: "Chianti Riserva DOC — Oro dei Sani", description: "Sangiovese 100%" },
    de: { name: "Chianti Riserva DOC — Oro dei Sani", description: "Sangiovese 100%" },
    it: { name: "Chianti Riserva DOC — Oro dei Sani", description: "Sangiovese 100%" },
  },
  "Edizione 5 Autoctoni VDT — Fantini": {
    en: { name: "Edizione 5 Autoctoni VDT — Fantini", description: "Montepulciano 33% · Primitivo 30% · Sangiovese 25% · Negroamaro 7% · Malvasia nera 5%" },
    de: { name: "Edizione 5 Autoctoni VDT — Fantini", description: "Montepulciano 33% · Primitivo 30% · Sangiovese 25% · Negroamaro 7% · Malvasia nera 5%" },
    it: { name: "Edizione 5 Autoctoni VDT — Fantini", description: "Montepulciano 33% · Primitivo 30% · Sangiovese 25% · Negroamaro 7% · Malvasia nera 5%" },
  },
  "San Giorgio IGT — Lungarotti": {
    en: { name: "San Giorgio IGT — Lungarotti", description: "Cabernet Sauvignon 50% · Sangiovese 40% · Canaiolo 10%" },
    de: { name: "San Giorgio IGT — Lungarotti", description: "Cabernet Sauvignon 50% · Sangiovese 40% · Canaiolo 10%" },
    it: { name: "San Giorgio IGT — Lungarotti", description: "Cabernet Sauvignon 50% · Sangiovese 40% · Canaiolo 10%" },
  },
  "Moscato d’Asti Bosc d’la Rei DOC — Beni di Batasiolo": {
    en: { name: "Moscato d’Asti Bosc d’la Rei DOC — Beni di Batasiolo", description: "Moscato Bianco 100%" },
    de: { name: "Moscato d’Asti Bosc d’la Rei DOC — Beni di Batasiolo", description: "Moscato Bianco 100%" },
    it: { name: "Moscato d’Asti Bosc d’la Rei DOC — Beni di Batasiolo", description: "Moscato Bianco 100%" },
  },
};
