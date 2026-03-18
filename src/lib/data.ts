export interface FoodItem {
  id: string;
  name: { bm: string; en: string };
  category: string;
  currentPrice: number;
  previousPrice: number;
  unit: string;
  region: string;
  trend: number[]; // last 8 weeks
  nationalAvg: number;
}

export interface Disruption {
  id: string;
  item: { bm: string; en: string };
  region: string;
  severity: "high" | "medium" | "low";
  description: { bm: string; en: string };
  date: string;
}

export interface PantryItem {
  id: string;
  name: string;
  expiryDays?: number; // days until expiry
}

export interface Recipe {
  id: string;
  name: { bm: string; en: string };
  ingredients: string[];
  prepTime: number;
  estimatedCost: number;
  calories: number;
  tags: string[];
  steps: { bm: string[]; en: string[] };
}

export const foodItems: FoodItem[] = [
  {
    id: "1", name: { bm: "Ayam Standard", en: "Standard Chicken" }, category: "protein",
    currentPrice: 10.40, previousPrice: 9.26, unit: "kg", region: "Selangor",
    trend: [8.90, 9.10, 9.26, 9.30, 9.50, 9.80, 10.10, 10.40], nationalAvg: 9.50,
  },
  {
    id: "2", name: { bm: "Beras Tempatan", en: "Local Rice" }, category: "grain",
    currentPrice: 2.60, previousPrice: 2.55, unit: "kg", region: "Nasional",
    trend: [2.50, 2.52, 2.50, 2.55, 2.55, 2.58, 2.58, 2.60], nationalAvg: 2.55,
  },
  {
    id: "3", name: { bm: "Telur Gred A", en: "Grade A Eggs" }, category: "protein",
    currentPrice: 0.45, previousPrice: 0.43, unit: "biji", region: "Nasional",
    trend: [0.40, 0.41, 0.42, 0.43, 0.43, 0.44, 0.44, 0.45], nationalAvg: 0.43,
  },
  {
    id: "4", name: { bm: "Minyak Masak", en: "Cooking Oil" }, category: "oil",
    currentPrice: 4.20, previousPrice: 4.50, unit: "L", region: "Nasional",
    trend: [4.80, 4.70, 4.60, 4.50, 4.40, 4.35, 4.25, 4.20], nationalAvg: 4.40,
  },
  {
    id: "5", name: { bm: "Bawang Merah", en: "Shallots" }, category: "vegetable",
    currentPrice: 7.80, previousPrice: 6.50, unit: "kg", region: "Perak",
    trend: [5.50, 5.80, 6.00, 6.20, 6.50, 7.00, 7.40, 7.80], nationalAvg: 6.20,
  },
  {
    id: "6", name: { bm: "Gula Pasir", en: "Granulated Sugar" }, category: "staple",
    currentPrice: 2.85, previousPrice: 2.85, unit: "kg", region: "Nasional",
    trend: [2.85, 2.85, 2.85, 2.85, 2.85, 2.85, 2.85, 2.85], nationalAvg: 2.85,
  },
];

export const disruptions: Disruption[] = [
  {
    id: "d1", item: { bm: "Ayam Standard", en: "Standard Chicken" }, region: "Selangor",
    severity: "high",
    description: { bm: "Harga purata naik ke RM10.40/kg akibat kelewatan bekalan dari ladang.", en: "Average price rose to RM10.40/kg due to farm supply delay." },
    date: "2026-03-17",
  },
  {
    id: "d2", item: { bm: "Bawang Merah", en: "Shallots" }, region: "Perak",
    severity: "medium",
    description: { bm: "Import dari India terganggu. Stok dijangka pulih dalam 2 minggu.", en: "India imports disrupted. Stock expected to recover in 2 weeks." },
    date: "2026-03-16",
  },
  {
    id: "d3", item: { bm: "Sayur Sawi", en: "Mustard Greens" }, region: "Cameron Highlands",
    severity: "low",
    description: { bm: "Hujan lebat menyebabkan penurunan sementara hasil tanaman.", en: "Heavy rain caused temporary drop in crop yield." },
    date: "2026-03-15",
  },
];

export const commonIngredients = [
  "Beras", "Telur", "Bawang Merah", "Bawang Putih", "Minyak Masak",
  "Garam", "Gula", "Kicap", "Cili", "Halia", "Serai", "Santan",
  "Ikan Bilis", "Udang Kering", "Kunyit", "Timun", "Tomato", "Sayur Sawi",
];

export const recipes: Recipe[] = [
  {
    id: "r1",
    name: { bm: "Nasi Goreng Telur", en: "Egg Fried Rice" },
    ingredients: ["Beras", "Telur", "Bawang Merah", "Kicap", "Minyak Masak", "Garam"],
    prepTime: 15, estimatedCost: 3.50, calories: 420,
    tags: ["halal", "cepat"],
    steps: {
      bm: ["Panaskan minyak", "Tumis bawang", "Masukkan nasi dan telur", "Kacau rata dengan kicap"],
      en: ["Heat oil", "Sauté shallots", "Add rice and egg", "Stir with soy sauce"],
    },
  },
  {
    id: "r2",
    name: { bm: "Telur Dadar Sayur", en: "Vegetable Omelette" },
    ingredients: ["Telur", "Bawang Merah", "Cili", "Garam", "Minyak Masak"],
    prepTime: 10, estimatedCost: 2.20, calories: 280,
    tags: ["halal", "vegetarian", "cepat"],
    steps: {
      bm: ["Pukul telur", "Campurkan sayur dihiris", "Goreng hingga masak"],
      en: ["Beat eggs", "Mix in sliced vegetables", "Fry until cooked"],
    },
  },
  {
    id: "r3",
    name: { bm: "Sup Sayur Ringkas", en: "Simple Vegetable Soup" },
    ingredients: ["Sayur Sawi", "Bawang Putih", "Halia", "Garam", "Telur"],
    prepTime: 20, estimatedCost: 2.80, calories: 150,
    tags: ["halal", "vegetarian", "low-carb"],
    steps: {
      bm: ["Rebus air", "Masukkan bawang putih dan halia", "Tambah sayur", "Pecahkan telur"],
      en: ["Boil water", "Add garlic and ginger", "Add vegetables", "Crack in egg"],
    },
  },
  {
    id: "r4",
    name: { bm: "Nasi Lemak Ringkas", en: "Simple Nasi Lemak" },
    ingredients: ["Beras", "Santan", "Telur", "Ikan Bilis", "Timun", "Garam"],
    prepTime: 30, estimatedCost: 4.50, calories: 550,
    tags: ["halal"],
    steps: {
      bm: ["Masak nasi dengan santan", "Goreng ikan bilis", "Goreng telur", "Hidang dengan timun"],
      en: ["Cook rice with coconut milk", "Fry anchovies", "Fry egg", "Serve with cucumber"],
    },
  },
  {
    id: "r5",
    name: { bm: "Tumis Sawi Bawang Putih", en: "Garlic Stir-Fried Greens" },
    ingredients: ["Sayur Sawi", "Bawang Putih", "Minyak Masak", "Garam"],
    prepTime: 10, estimatedCost: 2.00, calories: 90,
    tags: ["halal", "vegetarian", "low-carb", "cepat"],
    steps: {
      bm: ["Panaskan minyak", "Tumis bawang putih", "Masukkan sawi", "Masak 3 minit"],
      en: ["Heat oil", "Sauté garlic", "Add greens", "Cook 3 minutes"],
    },
  },
];
