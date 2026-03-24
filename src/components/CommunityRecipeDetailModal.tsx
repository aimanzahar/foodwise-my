import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/api";
import type { CommunityRecipe, RecipeComment } from "@/lib/contracts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Users, Star, MessageSquare, Lightbulb, Send, Loader2 } from "lucide-react";

interface CommunityRecipeDetailModalProps {
  recipe: CommunityRecipe | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function timeAgo(dateStr: string, lang: "bm" | "en"): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return lang === "bm" ? "sekarang" : "just now";
  if (diffMin < 60) return lang === "bm" ? `${diffMin}m lalu` : `${diffMin}m ago`;
  if (diffHr < 24) return lang === "bm" ? `${diffHr}j lalu` : `${diffHr}h ago`;
  if (diffDay < 7) return lang === "bm" ? `${diffDay}h lalu` : `${diffDay}d ago`;
  return new Date(dateStr).toLocaleDateString(lang === "bm" ? "ms-MY" : "en-US", {
    month: "short",
    day: "numeric",
  });
}

export function CommunityRecipeDetailModal({ recipe, open, onOpenChange }: CommunityRecipeDetailModalProps) {
  const { lang } = useI18n();
  const { user } = useAuth();
  const [comments, setComments] = useState<RecipeComment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

  const hasDescription = recipe?.description && recipe.description[lang]?.trim();
  const hasIngredients = recipe?.ingredients && recipe.ingredients.length > 0;
  const hasTips = recipe?.tips && recipe.tips[lang]?.trim();

  useEffect(() => {
    if (!recipe || !open) return;

    setLoadingComments(true);
    setComments([]);
    apiRequest<{ comments: RecipeComment[] }>(`/api/community-recipes/${recipe.id}/comments`)
      .then((res) => setComments(res.comments))
      .catch(() => {})
      .finally(() => setLoadingComments(false));
  }, [recipe, open]);

  async function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!recipe || !user || !commentText.trim()) return;

    setSubmitting(true);
    try {
      const res = await apiRequest<{ comments: RecipeComment[] }>(
        `/api/community-recipes/${recipe.id}/comments`,
        {
          method: "POST",
          body: JSON.stringify({ content: commentText.trim() }),
        },
      );
      setComments(res.comments);
      setCommentText("");
    } catch {
      // silently fail
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader className="space-y-3 pr-8">
          <DialogTitle className="text-xl font-bold text-foreground leading-tight">
            {recipe?.title[lang]}
          </DialogTitle>
          <DialogDescription className="flex flex-wrap gap-3 text-xs">
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              {recipe?.author}
            </span>
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Star className="h-3.5 w-3.5" />
              {recipe?.rating}/5
            </span>
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <MessageSquare className="h-3.5 w-3.5" />
              {comments.length}
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
              {recipe!.description[lang]}
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
              {recipe!.ingredients.map((ingredient, index) => (
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
              {recipe!.tips[lang]}
            </p>
          </div>
        )}

        {/* Comments Section */}
        <div className="mt-6 border-t border-border pt-4 space-y-3">
          <div className="text-sm font-semibold text-foreground">
            {lang === "bm" ? "Komen" : "Comments"} ({comments.length})
          </div>

          {/* Comment list */}
          {loadingComments ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          ) : comments.length === 0 ? (
            <p className="text-xs text-muted-foreground py-2">
              {lang === "bm"
                ? "Belum ada komen. Jadi yang pertama!"
                : "No comments yet. Be the first!"}
            </p>
          ) : (
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {comments.map((c) => (
                <div key={c.id} className="bg-muted/40 rounded-lg p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">{c.author}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {timeAgo(c.createdAt, lang)}
                    </span>
                  </div>
                  <p className="text-xs text-foreground leading-relaxed">{c.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* Add comment form */}
          {user && (
            <form onSubmit={handleSubmitComment} className="flex gap-2 mt-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={lang === "bm" ? "Tulis komen..." : "Write a comment..."}
                className="flex-1 text-sm bg-muted/40 border border-border rounded-lg px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                maxLength={500}
              />
              <button
                type="submit"
                disabled={submitting || !commentText.trim()}
                className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </form>
          )}

          {!user && (
            <p className="text-xs text-muted-foreground">
              {lang === "bm" ? "Daftar masuk untuk komen." : "Sign in to comment."}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
