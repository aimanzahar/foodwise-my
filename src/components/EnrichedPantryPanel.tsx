import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import type { CommonIngredient, PantryItem } from "@/lib/contracts";
import { X, Plus, Search, Minus as MinusIcon, ChevronDown, ChevronRight, Package } from "lucide-react";

interface EnrichedPantryPanelProps {
  pantry: PantryItem[];
  commonIngredients: CommonIngredient[];
  onAdd: (item: PantryItem) => void;
  onRemove: (name: string) => void;
  onUpdate: (name: string, updates: { quantity?: number; unit?: string }) => void;
}

const categoryKeys: Record<string, "catGrain" | "catProtein" | "catVegetable" | "catSpice" | "catStaple" | "catOil"> = {
  grain: "catGrain",
  protein: "catProtein",
  vegetable: "catVegetable",
  spice: "catSpice",
  staple: "catStaple",
  oil: "catOil",
};

const categoryOrder = ["grain", "protein", "vegetable", "spice", "staple", "oil"];

export function EnrichedPantryPanel({ pantry, commonIngredients, onAdd, onRemove, onUpdate }: EnrichedPantryPanelProps) {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(categoryOrder));

  const pantryMap = new Map(pantry.map((item) => [item.name, item]));

  const filtered = commonIngredients.filter(
    (ing) => ing.name.toLowerCase().includes(search.toLowerCase())
  );

  // Group by category
  const grouped = new Map<string, CommonIngredient[]>();
  for (const ing of filtered) {
    const cat = ing.category || "staple";
    const list = grouped.get(cat) ?? [];
    list.push(ing);
    grouped.set(cat, list);
  }

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const handleAdd = (ing: CommonIngredient) => {
    onAdd({
      name: ing.name,
      category: ing.category,
      quantity: 1,
      unit: ing.defaultUnit,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-bold text-foreground">{t("myPantry")}</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {pantry.length} {t("itemCount")}
        </p>
      </div>

      {/* Active pantry items as cards */}
      {pantry.length > 0 ? (
        <div className="grid grid-cols-2 gap-2">
          <AnimatePresence mode="popLayout">
            {pantry.map((item) => (
              <motion.div
                key={item.name}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15 }}
                className="rounded-xl bg-card p-3 card-shadow relative group"
              >
                <button
                  onClick={() => onRemove(item.name)}
                  className="absolute top-2 right-2 h-5 w-5 rounded-full bg-muted flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Remove ${item.name}`}
                >
                  <X className="h-3 w-3" />
                </button>
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground truncate">{item.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      if (item.quantity > 1) onUpdate(item.name, { quantity: item.quantity - 1 });
                    }}
                    className="h-6 w-6 rounded-md bg-muted flex items-center justify-center hover:bg-muted-foreground/20 transition-colors"
                    disabled={item.quantity <= 1}
                  >
                    <MinusIcon className="h-3 w-3" />
                  </button>
                  <span className="text-sm font-bold tabular-nums min-w-[2rem] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdate(item.name, { quantity: item.quantity + 1 })}
                    className="h-6 w-6 rounded-md bg-muted flex items-center justify-center hover:bg-muted-foreground/20 transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                  <span className="text-xs text-muted-foreground ml-1">{item.unit}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="rounded-xl bg-card p-6 card-shadow text-center">
          <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">{t("emptyPantry")}</p>
        </div>
      )}

      {/* Search & add section */}
      <div className="space-y-3">
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

        {/* Categorized ingredient list */}
        <div className="space-y-1">
          {categoryOrder.map((cat) => {
            const items = grouped.get(cat);
            if (!items || items.length === 0) return null;
            const isExpanded = expandedCategories.has(cat);
            const key = categoryKeys[cat] ?? "catStaple";

            return (
              <div key={cat}>
                <button
                  onClick={() => toggleCategory(cat)}
                  className="flex items-center gap-2 w-full py-2 text-left"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                  <span className="text-xs font-semibold text-foreground">{t(key)}</span>
                  <span className="text-[10px] text-muted-foreground">({items.length})</span>
                </button>
                {isExpanded && (
                  <div className="flex flex-wrap gap-1.5 pl-5 pb-2">
                    {items.map((ing) => {
                      const isInPantry = pantryMap.has(ing.name);
                      return (
                        <button
                          key={ing.name}
                          onClick={() => isInPantry ? onRemove(ing.name) : handleAdd(ing)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-150 ${
                            isInPantry
                              ? "chip-active text-primary"
                              : "bg-card card-shadow text-foreground hover:card-shadow-hover"
                          }`}
                        >
                          {!isInPantry && <Plus className="h-3 w-3" />}
                          {ing.name}
                          {isInPantry && <X className="h-3 w-3" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
