import React, { createContext, useContext, useState, useCallback } from "react";

type Lang = "bm" | "en";

const translations = {
  dashboard: { bm: "Papan Pemuka", en: "Dashboard" },
  pantry: { bm: "Pantri", en: "Pantry" },
  recipes: { bm: "Resipi", en: "Recipes" },
  community: { bm: "Komuniti", en: "Community" },
  priceAlerts: { bm: "Amaran Harga", en: "Price Alerts" },
  essentialPrices: { bm: "Harga Barang Kawalan", en: "Essential Prices" },
  priceTrends: { bm: "Trend Harga", en: "Price Trends" },
  myPantry: { bm: "Pantri Saya", en: "My Pantry" },
  addIngredient: { bm: "Tambah Bahan", en: "Add Ingredient" },
  suggestedRecipes: { bm: "Resipi Dicadangkan", en: "Suggested Recipes" },
  stable: { bm: "Stabil", en: "Stable" },
  spike: { bm: "Lonjakan", en: "Spike" },
  drop: { bm: "Penurunan", en: "Drop" },
  perKg: { bm: "/kg", en: "/kg" },
  perUnit: { bm: "/unit", en: "/unit" },
  perLitre: { bm: "/L", en: "/L" },
  mins: { bm: "min", en: "min" },
  ingredients: { bm: "bahan", en: "ingredients" },
  inPantry: { bm: "ada", en: "have" },
  estCost: { bm: "Anggaran kos", en: "Est. cost" },
  viewRecipe: { bm: "Lihat Resipi", en: "View Recipe" },
  supplyDisruptions: { bm: "Gangguan Bekalan", en: "Supply Disruptions" },
  nationalAvg: { bm: "Purata Nasional", en: "National Average" },
  weeklyTrend: { bm: "Trend Mingguan", en: "Weekly Trend" },
  quickAdd: { bm: "Tambah Cepat", en: "Quick Add" },
  commonStaples: { bm: "Bahan asas biasa", en: "Common staples" },
  expiringAlert: { bm: "Hampir tamat tempoh", en: "Expiring soon" },
  fromPantry: { bm: "dari pantri", en: "from pantry" },
  missing: { bm: "perlu beli", en: "need to buy" },
  highSeverity: { bm: "Teruk", en: "High" },
  medSeverity: { bm: "Sederhana", en: "Medium" },
  lowSeverity: { bm: "Rendah", en: "Low" },
  searchIngredient: { bm: "Cari bahan...", en: "Search ingredient..." },
  noRecipesFound: { bm: "Tiada resipi dijumpai", en: "No recipes found" },
  addMoreIngredients: { bm: "Tambah lagi bahan untuk cadangan resipi", en: "Add more ingredients for recipe suggestions" },
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
