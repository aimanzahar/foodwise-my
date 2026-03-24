import { useI18n } from "@/lib/i18n";
import type { Recipe } from "@/lib/contracts";
import { Clock, Flame } from "lucide-react";

interface RecipeCardProps {
  recipe: Recipe;
  pantry: string[];
  onClick?: () => void;
}

export function RecipeCard({ recipe, pantry, onClick }: RecipeCardProps) {
  const { lang, t } = useI18n();
  const matched = recipe.ingredients.filter((i) => pantry.includes(i)).length;
  const total = recipe.ingredients.length;
  const missing = total - matched;
  const matchPercent = total > 0 ? (matched / total) * 100 : 0;

  return (
    <div
      className="rounded-xl bg-card p-4 card-shadow transition-all duration-200 hover:card-shadow-hover hover:scale-[1.02] cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-bold text-foreground leading-snug">{recipe.name[lang]}</h3>
        <span className="shrink-0 text-[11px] font-semibold tabular-nums text-primary bg-primary/10 px-1.5 py-0.5 rounded">
          {matched}/{total}
        </span>
      </div>

      <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${matchPercent}%` }}
        />
      </div>

      <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground tabular-nums">
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" /> {recipe.prepTime} {t("mins")}
        </span>
        <span className="flex items-center gap-1">
          <Flame className="h-3 w-3" /> {recipe.calories} kcal
        </span>
        <span className="ml-auto font-semibold text-foreground">
          {t("estCost")}: RM{recipe.estimatedCost.toFixed(2)}
        </span>
      </div>

      {missing > 0 && (
        <p className="mt-2 text-[11px] text-muted-foreground">
          <span className="text-primary font-medium">{matched} {t("fromPantry")}</span>
          {" · "}
          <span className="text-destructive font-medium">{missing} {t("missing")}</span>
        </p>
      )}

      <div className="flex gap-1.5 mt-2">
        {recipe.tags.map((tag) => (
          <span key={tag} className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
