import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import type { FoodItem } from "@/lib/contracts";
import { PriceCard } from "./PriceCard";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

const categories = ["all", "protein", "groceries", "vegetables", "oils"] as const;

interface PriceViewProps {
  foodItems: FoodItem[];
}

export function PriceView({ foodItems }: PriceViewProps) {
  const { lang, t } = useI18n();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");

  const filtered = foodItems.filter((item) => {
    const matchesSearch = item.name[lang].toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || item.category.toLowerCase() === category;
    return matchesSearch && matchesCategory;
  });

  // Group by rating for overview
  const ratingCounts = { A: 0, B: 0, C: 0 };
  for (const item of foodItems) {
    if (item.rating === "A") ratingCounts.A++;
    else if (item.rating === "B") ratingCounts.B++;
    else if (item.rating === "C") ratingCounts.C++;
  }

  return (
    <div className="space-y-4">
      {/* A/B/C summary bar */}
      <div className="flex gap-2">
        <div className="flex-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 p-3 text-center">
          <span className="text-2xl font-black text-emerald-600">A</span>
          <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium mt-0.5">{t("ratingA")}</p>
          <p className="text-lg font-bold text-emerald-600 tabular-nums">{ratingCounts.A}</p>
        </div>
        <div className="flex-1 rounded-xl bg-amber-50 dark:bg-amber-950/30 p-3 text-center">
          <span className="text-2xl font-black text-amber-600">B</span>
          <p className="text-[10px] text-amber-700 dark:text-amber-400 font-medium mt-0.5">{t("ratingB")}</p>
          <p className="text-lg font-bold text-amber-600 tabular-nums">{ratingCounts.B}</p>
        </div>
        <div className="flex-1 rounded-xl bg-red-50 dark:bg-red-950/30 p-3 text-center">
          <span className="text-2xl font-black text-red-600">C</span>
          <p className="text-[10px] text-red-700 dark:text-red-400 font-medium mt-0.5">{t("ratingC")}</p>
          <p className="text-lg font-bold text-red-600 tabular-nums">{ratingCounts.C}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("searchItem")}
          className="w-full h-10 pl-8 pr-3 text-sm rounded-lg bg-card card-shadow border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      {/* Category tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              category === cat
                ? "bg-primary text-primary-foreground"
                : "bg-card card-shadow text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat === "all" ? t("allCategories") : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Price grid */}
      <div className="grid grid-cols-2 gap-2">
        {filtered.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, delay: i * 0.03 }}
          >
            <PriceCard item={item} />
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">{t("noRecipesFound")}</p>
      )}
    </div>
  );
}
