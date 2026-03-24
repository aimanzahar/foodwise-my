import { useI18n } from "@/lib/i18n";
import type { Recipe } from "@/lib/contracts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Clock, Flame, ChefHat, ShoppingBasket, Check, X } from "lucide-react";

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pantry: string[];
}

export function RecipeDetailModal({ recipe, open, onOpenChange, pantry }: RecipeDetailModalProps) {
  const { lang, t } = useI18n();

  if (!recipe) return null;

  const matchedIngredients = recipe.ingredients.filter((i) => pantry.includes(i));
  const missingIngredients = recipe.ingredients.filter((i) => !pantry.includes(i));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader className="space-y-3 pr-8">
          <DialogTitle className="text-xl font-bold text-foreground leading-tight">
            {recipe.name[lang]}
          </DialogTitle>
          <DialogDescription className="flex flex-wrap gap-3 text-xs">
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {recipe.prepTime} {t("mins")}
            </span>
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Flame className="h-3.5 w-3.5" />
              {recipe.calories} kcal
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-foreground">
              {t("estCost")}: RM{recipe.estimatedCost.toFixed(2)}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-1.5 mt-2">
          {recipe.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Ingredients Section */}
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <ShoppingBasket className="h-4 w-4 text-primary" />
            {lang === "bm" ? "Bahan-bahan" : "Ingredients"}
            <span className="text-xs font-normal text-muted-foreground ml-auto">
              {matchedIngredients.length}/{recipe.ingredients.length} {t("fromPantry")}
            </span>
          </div>

          {/* Match progress bar */}
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{
                width: `${(matchedIngredients.length / recipe.ingredients.length) * 100}%`,
              }}
            />
          </div>

          <div className="space-y-2">
            {matchedIngredients.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-[10px] font-medium text-primary uppercase tracking-wide">
                  {lang === "bm" ? "Ada dalam pantry" : "In Pantry"}
                </p>
                {matchedIngredients.map((ingredient) => (
                  <div
                    key={ingredient}
                    className="flex items-center gap-2 text-sm text-foreground bg-primary/5 px-3 py-1.5 rounded-lg"
                  >
                    <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>{ingredient}</span>
                  </div>
                ))}
              </div>
            )}

            {missingIngredients.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-[10px] font-medium text-destructive uppercase tracking-wide">
                  {lang === "bm" ? "Tidak ada dalam pantry" : "Missing"}
                </p>
                {missingIngredients.map((ingredient) => (
                  <div
                    key={ingredient}
                    className="flex items-center gap-2 text-sm text-foreground bg-destructive/5 px-3 py-1.5 rounded-lg"
                  >
                    <X className="h-3.5 w-3.5 text-destructive shrink-0" />
                    <span>{ingredient}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Steps Section */}
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <ChefHat className="h-4 w-4 text-primary" />
            {lang === "bm" ? "Langkah-langkah" : "Steps"}
          </div>

          <div className="space-y-3">
            {recipe.steps[lang].map((step, index) => (
              <div key={index} className="flex gap-3">
                <div className="shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
                <p className="text-sm text-foreground leading-relaxed pt-0.5">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
