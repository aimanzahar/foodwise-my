import React, { createContext, useContext, useState, useCallback } from "react";

type Lang = "bm" | "en";

const translations = {
  // Navigation — 3 modules
  harga: { bm: "Harga", en: "Prices" },
  pantriResipi: { bm: "Pantri & Resipi", en: "Pantry & Recipes" },
  gangguan: { bm: "Gangguan", en: "Disruptions" },
  // Legacy nav keys kept for compatibility
  dashboard: { bm: "Papan Pemuka", en: "Dashboard" },
  pantry: { bm: "Pantri", en: "Pantry" },
  recipes: { bm: "Resipi", en: "Recipes" },
  community: { bm: "Komuniti", en: "Community" },
  // Price module
  priceAlerts: { bm: "Amaran Harga", en: "Price Alerts" },
  essentialPrices: { bm: "Harga Barang Kawalan", en: "Essential Prices" },
  priceTrends: { bm: "Trend Harga", en: "Price Trends" },
  searchItem: { bm: "Cari barang...", en: "Search item..." },
  allCategories: { bm: "Semua", en: "All" },
  // A/B/C Hargapedia rating
  ratingA: { bm: "Ambil je!", en: "Grab it!" },
  ratingB: { bm: "Boleh la", en: "Fair price" },
  ratingC: { bm: "Chup dulu", en: "Hold on" },
  ratingADesc: { bm: "Harga paling rendah 3 bulan", en: "Cheapest in 3 months" },
  ratingBDesc: { bm: "Harga berpatutan", en: "Reasonable price" },
  ratingCDesc: { bm: "Lebih mahal dari biasa", en: "Higher than usual" },
  // Pantry module
  myPantry: { bm: "Pantri Saya", en: "My Pantry" },
  addIngredient: { bm: "Tambah Bahan", en: "Add Ingredient" },
  suggestedRecipes: { bm: "Resipi Dicadangkan", en: "Suggested Recipes" },
  quickAdd: { bm: "Tambah Cepat", en: "Quick Add" },
  commonStaples: { bm: "Bahan asas biasa", en: "Common staples" },
  searchIngredient: { bm: "Cari bahan...", en: "Search ingredient..." },
  // Pantry categories
  catGrain: { bm: "Bijirin & Karbohidrat", en: "Grains & Carbs" },
  catProtein: { bm: "Protein", en: "Protein" },
  catVegetable: { bm: "Sayur & Buah", en: "Vegetables & Fruits" },
  catSpice: { bm: "Rempah & Herba", en: "Herbs & Spices" },
  catStaple: { bm: "Bahan Asas", en: "Staples" },
  catOil: { bm: "Minyak & Tenusu", en: "Oils & Dairy" },
  // Pantry sub-tabs
  tabPantry: { bm: "Pantri", en: "Pantry" },
  tabRecipes: { bm: "Resipi", en: "Recipes" },
  tabCommunity: { bm: "Komuniti", en: "Community" },
  // Pantry enriched
  emptyPantry: { bm: "Pantri anda kosong. Tambah bahan!", en: "Your pantry is empty. Add items!" },
  itemCount: { bm: "item", en: "items" },
  // Price trends
  stable: { bm: "Stabil", en: "Stable" },
  spike: { bm: "Lonjakan", en: "Spike" },
  drop: { bm: "Penurunan", en: "Drop" },
  perKg: { bm: "/kg", en: "/kg" },
  perUnit: { bm: "/unit", en: "/unit" },
  perLitre: { bm: "/L", en: "/L" },
  // Recipe details
  mins: { bm: "min", en: "min" },
  ingredients: { bm: "bahan", en: "ingredients" },
  inPantry: { bm: "ada", en: "have" },
  estCost: { bm: "Anggaran kos", en: "Est. cost" },
  viewRecipe: { bm: "Lihat Resipi", en: "View Recipe" },
  fromPantry: { bm: "dari pantri", en: "from pantry" },
  missing: { bm: "perlu beli", en: "need to buy" },
  noRecipesFound: { bm: "Tiada resipi dijumpai", en: "No recipes found" },
  addMoreIngredients: { bm: "Tambah lagi bahan untuk cadangan resipi", en: "Add more ingredients for recipe suggestions" },
  // Disruption module
  supplyDisruptions: { bm: "Gangguan Bekalan", en: "Supply Disruptions" },
  disruptionCentre: { bm: "Pusat Notis Gangguan", en: "Disruption Notice Centre" },
  activeDisruptions: { bm: "Gangguan Aktif", en: "Active Disruptions" },
  nationalAvg: { bm: "Purata Nasional", en: "National Average" },
  weeklyTrend: { bm: "Trend Mingguan", en: "Weekly Trend" },
  highSeverity: { bm: "Teruk", en: "High" },
  medSeverity: { bm: "Sederhana", en: "Medium" },
  lowSeverity: { bm: "Rendah", en: "Low" },
  // Community
  description: { bm: "Penerangan", en: "Description" },
  tips: { bm: "Tips", en: "Tips" },
  rating: { bm: "Penilaian", en: "Rating" },
  comments: { bm: "Komen", en: "Comments" },
  expiringAlert: { bm: "Hampir tamat tempoh", en: "Expiring soon" },
} as const;

type TranslationKey = keyof typeof translations;

interface I18nContextType {
  lang: Lang;
  toggleLang: () => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("bm");
  const toggleLang = useCallback(() => setLang((l) => (l === "bm" ? "en" : "bm")), []);
  const t = useCallback((key: TranslationKey) => translations[key]?.[lang] ?? key, [lang]);

  return (
    <I18nContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
