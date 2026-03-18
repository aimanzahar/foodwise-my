import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { commonIngredients } from "@/lib/data";
import { X, Plus, Search } from "lucide-react";

interface PantryPanelProps {
  pantry: string[];
  toggleItem: (item: string) => void;
}

export function PantryPanel({ pantry, toggleItem }: PantryPanelProps) {
  const { t } = useI18n();
  const [search, setSearch] = useState("");

  const filtered = commonIngredients.filter(
    (ing) => ing.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-bold text-foreground">{t("myPantry")}</h2>
        <p className="text-xs text-muted-foreground mt-0.5">{t("quickAdd")} — {t("commonStaples")}</p>
      </div>

      {/* Active pantry items */}
      <div className="flex flex-wrap gap-2 min-h-[40px]" aria-live="polite">
        <AnimatePresence mode="popLayout">
          {pantry.map((item) => (
            <motion.button
              key={item}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15, ease: [0.2, 0, 0, 1] }}
              onClick={() => toggleItem(item)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium chip-active text-primary"
            >
              {item}
              <X className="h-3 w-3" />
            </motion.button>
          ))}
        </AnimatePresence>
        {pantry.length === 0 && (
          <p className="text-xs text-muted-foreground italic py-1.5">{t("addIngredient")}</p>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("searchIngredient")}
          className="w-full h-10 pl-8 pr-3 text-sm rounded-lg bg-card card-shadow border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      {/* Ingredient grid */}
      <div className="flex flex-wrap gap-2">
        {filtered.map((item) => {
          const isActive = pantry.includes(item);
          return (
            <button
              key={item}
              onClick={() => toggleItem(item)}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                isActive
                  ? "chip-active text-primary"
                  : "bg-card card-shadow text-foreground hover:card-shadow-hover"
              }`}
            >
              {!isActive && <Plus className="h-3 w-3" />}
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}
