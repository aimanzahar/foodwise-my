import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import type { Recipe } from "@/lib/contracts";
import { RecipeCard } from "./RecipeCard";
import { RecipeDetailModal } from "./RecipeDetailModal";
import { motion } from "framer-motion";

interface RecipesViewProps {
  pantry: string[];
  recipes: Recipe[];
}

export function RecipesView({ pantry, recipes }: RecipesViewProps) {
  const { t } = useI18n();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const matchingRecipes = [...recipes]
    .filter((r) => pantry.every((p) => r.ingredients.includes(p)))
    .map((r) => {
      const matched = r.ingredients.filter((i) => pantry.includes(i)).length;
      return { recipe: r, matched, total: r.ingredients.length };
    })
    .sort((a, b) => {
      // Primary: higher match percentage
      const aPct = a.matched / a.total;
      const bPct = b.matched / b.total;
      if (Math.abs(aPct - bPct) > 0.001) return bPct - aPct;
      // Secondary: lower estimated cost
      return a.recipe.estimatedCost - b.recipe.estimatedCost;
    });

  const hasAnyIngredient = pantry.length > 0;
  const hasMatches = matchingRecipes.length > 0;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-bold text-foreground">{t("suggestedRecipes")}</h2>
        {!hasAnyIngredient && (
          <p className="text-xs text-muted-foreground mt-0.5">{t("addMoreIngredients")}</p>
        )}
        {hasAnyIngredient && !hasMatches && (
          <p className="text-xs text-muted-foreground mt-0.5">{t("noRecipesFound")}</p>
        )}
        {hasMatches && (
          <p className="text-xs text-muted-foreground mt-0.5 tabular-nums">
            {matchingRecipes.length} {t("recipes").toLowerCase()} · {t("estCost")}: RM{matchingRecipes[0]?.recipe.estimatedCost.toFixed(2)} – RM{matchingRecipes[matchingRecipes.length - 1]?.recipe.estimatedCost.toFixed(2)}
          </p>
        )}
      </div>

      <div className="space-y-2">
        {matchingRecipes.map(({ recipe }, i) => (
          <motion.div
            key={recipe.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, delay: i * 0.04, ease: [0.2, 0, 0, 1] }}
          >
            <RecipeCard recipe={recipe} pantry={pantry} onClick={() => setSelectedRecipe(recipe)} />
          </motion.div>
        ))}
      </div>

      <RecipeDetailModal
        recipe={selectedRecipe}
        open={selectedRecipe !== null}
        onOpenChange={(open) => !open && setSelectedRecipe(null)}
        pantry={pantry}
      />
    </div>
  );
}
