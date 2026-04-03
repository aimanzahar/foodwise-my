import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import type { CommonIngredient, CommunityRecipe, PantryItem, Recipe } from "@/lib/contracts";
import { EnrichedPantryPanel } from "./EnrichedPantryPanel";
import { RecipesView } from "./RecipesView";
import { CommunityView } from "./CommunityView";

interface PantryRecipeViewProps {
  pantry: PantryItem[];
  commonIngredients: CommonIngredient[];
  recipes: Recipe[];
  communityRecipes: CommunityRecipe[];
  onAddPantryItem: (item: PantryItem) => void;
  onRemovePantryItem: (name: string) => void;
  onUpdatePantryItem: (name: string, updates: { quantity?: number; unit?: string }) => void;
}

type SubTab = "pantry" | "recipes" | "community";

export function PantryRecipeView({
  pantry,
  commonIngredients,
  recipes,
  communityRecipes,
  onAddPantryItem,
  onRemovePantryItem,
  onUpdatePantryItem,
}: PantryRecipeViewProps) {
  const { t } = useI18n();
  const [subTab, setSubTab] = useState<SubTab>("pantry");

  const subTabs: { id: SubTab; label: string }[] = [
    { id: "pantry", label: t("tabPantry") },
    { id: "recipes", label: t("tabRecipes") },
    { id: "community", label: t("tabCommunity") },
  ];

  // Convert PantryItem[] to string[] for RecipesView compatibility
  const pantryNames = pantry.map((item) => item.name);

  return (
    <div className="space-y-4">
      {/* Sub-tab navigation */}
      <div className="flex gap-1 bg-muted rounded-lg p-1">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 ${
              subTab === tab.id
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sub-tab content */}
      {subTab === "pantry" && (
        <EnrichedPantryPanel
          pantry={pantry}
          commonIngredients={commonIngredients}
          onAdd={onAddPantryItem}
          onRemove={onRemovePantryItem}
          onUpdate={onUpdatePantryItem}
        />
      )}
      {subTab === "recipes" && (
        <RecipesView pantry={pantryNames} recipes={recipes} />
      )}
      {subTab === "community" && (
        <CommunityView communityRecipes={communityRecipes} />
      )}
    </div>
  );
}
