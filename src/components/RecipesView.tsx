import { useI18n } from "@/lib/i18n";
import type { Recipe } from "@/lib/contracts";
import { RecipeCard } from "./RecipeCard";
import { motion } from "framer-motion";

interface RecipesViewProps {
  pantry: string[];
  recipes: Recipe[];
}

export function RecipesView({ pantry, recipes }: RecipesViewProps) {
  const { t } = useI18n();

  const fullMatches = [...recipes]
    .filter((r) => r.ingredients.every((i) => pantry.includes(i)))
    .sort((a, b) => a.estimatedCost - b.estimatedCost);

  const hasAnyIngredient = pantry.length > 0;
  const hasMatches = fullMatches.length > 0;

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
            {fullMatches.length} {t("recipes").toLowerCase()} · {t("estCost")}: RM{fullMatches[0]?.estimatedCost.toFixed(2)} – RM{fullMatches[fullMatches.length - 1]?.estimatedCost.toFixed(2)}
          </p>
        )}
      </div>

      <div className="space-y-2">
        {fullMatches.map((recipe, i) => (
          <motion.div
            key={recipe.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, delay: i * 0.04, ease: [0.2, 0, 0, 1] }}
          >
            <RecipeCard recipe={recipe} pantry={pantry} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
