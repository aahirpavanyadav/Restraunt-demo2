/**
 * Restaurant Demo Data Store
 * Brand: LUMINA | Modern Hearth & Dining
 */

const RESTAURANT_DATA = {
  info: {
    name: "LUMINA",
    subtitle: "Modern Hearth & Botanical Lounge",
    tagline: "An elemental culinary journey guided by flame, seasonality, and local artisans.",
    address: "428 Grandview Promenade, Suite 100, Waterfront District",
    phone: "+1 (555) 782-9400",
    email: "reservations@luminadining.com",
    hours: [
      { days: "Tuesday – Thursday", dinner: "5:00 PM – 10:30 PM", bar: "4:00 PM – 11:30 PM" },
      { days: "Friday – Saturday", dinner: "5:00 PM – 11:30 PM", bar: "4:00 PM – 1:00 AM" },
      { days: "Sunday Brunch & Dinner", dinner: "11:00 AM – 9:30 PM", bar: "11:00 AM – 10:30 PM" },
      { days: "Monday", dinner: "Closed for Private Events", bar: "Closed" }
    ],
    awards: [
      { title: "Michelin Guide", desc: "Selected 2024 & 2025" },
      { title: "James Beard Nominee", desc: "Best Chef Northwest" },
      { title: "Wine Spectator", desc: "Best of Award of Excellence" },
      { title: "Architectural Digest", desc: "Top 10 Dining Atmospheres" }
    ]
  },

  menuCategories: [
    { id: "all", name: "Full Collection" },
    { id: "starters", name: "Starters & Small Plates" },
    { id: "mains", name: "Hearth Mains" },
    { id: "raw-bar", name: "Raw Bar & Ocean" },
    { id: "desserts", name: "Confections" },
    { id: "cocktails", name: "Cellar & Cocktails" }
  ],

  menuItems: [
    {
      id: "item-1",
      name: "Truffle Burrata & Heirloom Fig",
      category: "starters",
      price: 24,
      description: "Pugliese burrata, wood-charred mission figs, 25-year aged balsamic, toasted pine nut brittle, micro basil.",
      tags: ["Vegetarian", "Chef's Signature"],
      image: "https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=800&q=80",
      calories: "410 kcal",
      allergens: ["Dairy", "Tree Nuts"],
      winePairing: "Domaine Vacheron Sancerre Blanc 2022",
      prepTime: "12 mins"
    },
    {
      id: "item-2",
      name: "Pan-Seared Hokkaido Scallops",
      category: "starters",
      price: 28,
      description: "Caramelized diver scallops, sunchoke purée, crisp guanciale lardons, brown butter hazelnut drizzle, trout roe.",
      tags: ["Gluten Free", "Chef's Signature"],
      image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=80",
      calories: "360 kcal",
      allergens: ["Shellfish", "Tree Nuts", "Dairy"],
      winePairing: "Meursault Premier Cru Chardonnay",
      prepTime: "14 mins"
    },
    {
      id: "item-3",
      name: "A5 Miyazaki Wagyu Tartare",
      category: "starters",
      price: 32,
      description: "Hand-cut Japanese A5 beef, cured quail egg yolk, smoked bone marrow emulsion, pickled shallots, sourdough lavash.",
      tags: ["Chef's Signature"],
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
      calories: "480 kcal",
      allergens: ["Eggs", "Gluten"],
      winePairing: "Barolo Vietti Castiglione 2019",
      prepTime: "10 mins"
    },
    {
      id: "item-4",
      name: "Wood-Fired Wild Maitake",
      category: "starters",
      price: 22,
      description: "Coal-roasted hen of the woods mushrooms, whipped garlic cashew cream, fermented chili glaze, charred scallion oil.",
      tags: ["Vegan", "Gluten Free"],
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
      calories: "290 kcal",
      allergens: ["Tree Nuts"],
      winePairing: "Willamette Valley Pinot Noir 2021",
      prepTime: "10 mins"
    },
    {
      id: "item-5",
      name: "45-Day Dry-Aged Prime Ribeye (14oz)",
      category: "mains",
      price: 76,
      description: "Oak-fired bone-in ribeye, black garlic confit compound butter, roasted cipollini onions, blistered vine tomatoes, red wine demi.",
      tags: ["Gluten Free", "Chef's Signature"],
      image: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80",
      calories: "890 kcal",
      allergens: ["Dairy"],
      winePairing: "Napa Valley Cabernet Sauvignon Caymus 2020",
      prepTime: "22 mins"
    },
    {
      id: "item-6",
      name: "Miso-Glazed Chilean Sea Bass",
      category: "mains",
      price: 58,
      description: "Sustainably caught sea bass, sweet white miso glaze, baby bok choy, shiitake dashi broth, lotus root crisp.",
      tags: ["Gluten Free", "Best Seller"],
      image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
      calories: "620 kcal",
      allergens: ["Fish", "Soy"],
      winePairing: "Chablis Premier Cru 2021",
      prepTime: "18 mins"
    },
    {
      id: "item-7",
      name: "Morel & Black Truffle Hand-Rolled Gnocchi",
      category: "mains",
      price: 42,
      description: "Ricotta pillow gnocchi, foraged Oregon morel mushrooms, fresh black winter truffle shavings, parmigiano-reggiano foam.",
      tags: ["Vegetarian", "Chef's Signature"],
      image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281720?auto=format&fit=crop&w=800&q=80",
      calories: "540 kcal",
      allergens: ["Dairy", "Gluten", "Eggs"],
      winePairing: "Brunello di Montalcino 2017",
      prepTime: "16 mins"
    },
    {
      id: "item-8",
      name: "Heritage Duck Breast with Spiced Fig",
      category: "mains",
      price: 52,
      description: "Pan-roasted Liberty duck breast, spiced port fig reduction, parsnip silk, charred Romanesco, crispy duck crackling.",
      tags: ["Gluten Free"],
      image: "https://images.unsplash.com/photo-1514944298352-78d123d58252?auto=format&fit=crop&w=800&q=80",
      calories: "670 kcal",
      allergens: ["Dairy"],
      winePairing: "Syrah Côte-Rôtie 2018",
      prepTime: "20 mins"
    },
    {
      id: "item-9",
      name: "Pacific Kumamoto Oysters (Half Dozen)",
      category: "raw-bar",
      price: 29,
      description: "Freshly shucked Kumamoto oysters, champagne pink-peppercorn mignonette, fresh grated yuzu, yuzu kosho caviar.",
      tags: ["Gluten Free", "Raw"],
      image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80",
      calories: "140 kcal",
      allergens: ["Shellfish"],
      winePairing: "Champagne Ruinart Blanc de Blancs NV",
      prepTime: "8 mins"
    },
    {
      id: "item-10",
      name: "Tuna & Caviar Mosaic",
      category: "raw-bar",
      price: 36,
      description: "Bigeye tuna sashimi, Royal Osetra caviar, avocado velvet, pickled daikon radish, Meyer lemon ponzu vinaigrette.",
      tags: ["Gluten Free", "Chef's Signature"],
      image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80",
      calories: "310 kcal",
      allergens: ["Fish"],
      winePairing: "Domaine Ott Côtes de Provence Rosé",
      prepTime: "10 mins"
    },
    {
      id: "item-11",
      name: "Smoked Bourbon Valrhona Fondant",
      category: "desserts",
      price: 18,
      description: "70% Valrhona dark chocolate warm cake, liquid salted caramel core, smoked Tahitian vanilla bean gelato, gold leaf.",
      tags: ["Vegetarian", "Signature"],
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
      calories: "520 kcal",
      allergens: ["Dairy", "Eggs", "Gluten"],
      winePairing: "Taylor Fladgate 20 Year Old Tawny Port",
      prepTime: "15 mins"
    },
    {
      id: "item-12",
      name: "Matcha Meyer Lemon Tart",
      category: "desserts",
      price: 16,
      description: "Kyoto ceremonial matcha curd, torched Swiss meringue, almond sablé crust, candied kumquat chips.",
      tags: ["Vegetarian"],
      image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80",
      calories: "380 kcal",
      allergens: ["Dairy", "Eggs", "Tree Nuts", "Gluten"],
      winePairing: "Château d'Yquem Sauternes 2016",
      prepTime: "10 mins"
    },
    {
      id: "item-13",
      name: "Smoked Rosemary Old Fashioned",
      category: "cocktails",
      price: 21,
      description: "WhistlePig 10-Year Rye, house smoked rosemary syrup, Angostura & walnut bitters, torch-flamed orange peel, crystal hand-cut ice.",
      tags: ["Signature Cocktail"],
      image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80",
      calories: "210 kcal",
      allergens: ["Tree Nuts"],
      winePairing: "Pair with Dry-Aged Ribeye",
      prepTime: "4 mins"
    },
    {
      id: "item-14",
      name: "Botanical Empress French 75",
      category: "cocktails",
      price: 20,
      description: "Empress 1908 Indigo Gin, fresh Meyer lemon juice, organic lavender floral cordial, topped with Laurent-Perrier Champagne.",
      tags: ["Signature Cocktail"],
      image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80",
      calories: "175 kcal",
      allergens: [],
      winePairing: "Pair with Oysters & Raw Bar",
      prepTime: "3 mins"
    }
  ],

  testimonials: [
    {
      name: "Marcus Vance",
      title: "Senior Food Critic, Epicurean Gazette",
      quote: "LUMINA reinvents the hearth with astonishing subtlety. The dry-aged ribeye and Hokkaido scallops are masterclasses in fire control and plate composition.",
      stars: 5,
      date: "October 2024",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "Evelyn & Julian Hayes",
      title: "Anniversary Guests",
      quote: "We spent our 10th anniversary at the Chef's Counter. The wine pairing by Sommelier Clara was celestial. An evening we will remember for years.",
      stars: 5,
      date: "November 2024",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
    },
    {
      name: "Chef Liam Sterling",
      title: "Private Events Director, Vantage Global",
      quote: "We hosted our executive annual retreat in Lumina's Greenhouse Salon. Flawless hospitality, exquisite courses, and flawless dietary accommodation.",
      stars: 5,
      date: "December 2024",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
    }
  ],

  team: [
    {
      name: "Mateo Alvarez",
      role: "Executive Chef & Founder",
      bio: "Trained in San Sebastián and Lyon, Chef Mateo celebrates coastal ingredients kissed by open fire and wood embers.",
      image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Clara Laurent",
      role: "Head Sommelier & Cellar Master",
      bio: "Curator of our 1,200-bottle cellar, focusing on biodynamic vineyards and rare Old World vintages.",
      image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Julien Mercier",
      role: "Master Pastry Chef",
      bio: "Crafting architectural desserts harmonizing French technique with seasonal orchard harvests.",
      image: "https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=600&q=80"
    }
  ],

  seatingAreas: [
    { id: "main", name: "Main Hearth Dining", desc: "Cozy leather booths adjacent to our central roaring wood-fired hearth." },
    { id: "greenhouse", name: "Botanical Greenhouse", desc: "Surrounded by lush climbing jasmine, glass atrium roof, and starlight." },
    { id: "chef", name: "Chef's Counter (Tasting)", desc: "Front-row interactive seating watching Chef Mateo plate each course." },
    { id: "patio", name: "Terrace & Water View", desc: "Heated alfresco dining overlooking the harbor promenade." }
  ]
};
