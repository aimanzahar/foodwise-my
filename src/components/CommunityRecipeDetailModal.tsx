import { useI18n } from "@/lib/i18n";
import type { CommunityRecipe } from "@/lib/contracts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Users, Star, MessageSquare, Lightbulb } from "lucide-react";

interface CommunityRecipeDetailModalProps {
  recipe: CommunityRecipe | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommunityRecipeDetailModal({ recipe, open, onOpenChange }: CommunityRecipeDetailModalProps) {
  const { lang } = useI18n();

  if (!recipe) return null;

  const hasDescription = recipe.description && recipe.description[lang]?.trim();
  const hasIngredients = recipe.ingredients && recipe.ingredients.length > 0;
  const hasTips = recipe.tips && recipe.tips[lang]?.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader className="space-y-3 pr-8">
          <DialogTitle className="text-xl font-bold text-foreground leading-tight">
            {recipe.title[lang]}
          </DialogTitle>
          <DialogDescription className="flex flex-wrap gap-3 text-xs">
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              {recipe.author}
            </span>
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Star className="h-3.5 w-3.5" />
              {recipe.rating}/5
            </span>
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <MessageSquare className="h-3.5 w-3.5" />
              {recipe.comments}
            </span>
          </DialogDescription>
        </DialogHeader>

        {/* Empty state fallback */}
        {!hasDescription && !hasIngredients && !hasTips && (
          <div className="mt-4 text-sm text-muted-foreground">
            {lang === "bm"
              ? "Tiada butiran untuk resipi ini lagi."
              : "No details for this recipe yet."}
          </div>
        )}

        {/* Description Section */}
        {hasDescription && (
          <div className="mt-4 space-y-2">
            <div className="text-sm font-semibold text-foreground">
              {lang === "bm" ? "Penerangan" : "Description"}
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              {recipe.description[lang]}
            </p>
          </div>
        )}

        {/* Ingredients Section */}
        {hasIngredients && (
          <div className="mt-4 space-y-2">
            <div className="text-sm font-semibold text-foreground">
              {lang === "bm" ? "Bahan-bahan" : "Ingredients"}
            </div>
            <ul className="space-y-1.5">
              {recipe.ingredients.map((ingredient, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-sm text-foreground"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tips Section */}
        {hasTips && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Lightbulb className="h-4 w-4 text-primary" />
              Tips
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              {recipe.tips[lang]}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
