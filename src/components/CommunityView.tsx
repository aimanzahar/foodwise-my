import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import type { CommunityRecipe } from "@/lib/contracts";
import { Users, MessageSquare, Star } from "lucide-react";
import { CommunityRecipeDetailModal } from "./CommunityRecipeDetailModal";

interface CommunityViewProps {
  communityRecipes: CommunityRecipe[];
}

export function CommunityView({ communityRecipes }: CommunityViewProps) {
  const { lang, t } = useI18n();
  const [selectedRecipe, setSelectedRecipe] = useState<CommunityRecipe | null>(null);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-bold text-foreground">{t("community")}</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {lang === "bm" ? "Resipi dari pengguna lain" : "Recipes from other users"}
        </p>
      </div>

      <div className="space-y-2">
        {communityRecipes.map((r) => (
          <div
            key={r.id}
            className="rounded-xl bg-card p-4 card-shadow transition-all duration-200 hover:card-shadow-hover cursor-pointer hover:scale-[1.02]"
            onClick={() => setSelectedRecipe(r)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelectedRecipe(r); } }}
            role="button"
            tabIndex={0}
          >
            <h3 className="text-sm font-bold text-foreground">{r.title[lang]}</h3>
            <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" /> {r.author}
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 text-warning" /> {r.rating}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" /> {r.comments}
              </span>
            </div>
          </div>
        ))}
      </div>

      <CommunityRecipeDetailModal
        recipe={selectedRecipe}
        open={selectedRecipe !== null}
        onOpenChange={(open) => !open && setSelectedRecipe(null)}
      />
    </div>
  );
}
