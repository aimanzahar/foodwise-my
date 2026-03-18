import { useI18n } from "@/lib/i18n";
import { Users, MessageSquare, Star } from "lucide-react";

const communityRecipes = [
  { id: "c1", title: { bm: "Sambal Telur Paling Jimat", en: "Budget Egg Sambal" }, author: "Puan Siti", rating: 4.5, comments: 12 },
  { id: "c2", title: { bm: "Mi Goreng Ala Mamak", en: "Mamak Style Fried Noodles" }, author: "Hafiz_KL", rating: 4.8, comments: 28 },
  { id: "c3", title: { bm: "Sup Tulang Mudah", en: "Easy Bone Soup" }, author: "Kak Anis", rating: 4.2, comments: 7 },
];

export function CommunityView() {
  const { lang, t } = useI18n();

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
          <div key={r.id} className="rounded-xl bg-card p-4 card-shadow transition-shadow hover:card-shadow-hover">
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
    </div>
  );
}
