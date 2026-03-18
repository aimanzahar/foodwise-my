import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { Shield, LogOut } from "lucide-react";

export function TopBar() {
  const { lang, toggleLang } = useI18n();
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm card-shadow">
      <div className="flex items-center justify-between h-12 px-4 max-w-lg mx-auto">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" strokeWidth={2.5} />
          <span className="text-sm font-bold tracking-tight text-foreground">
            MasakApa
            <span className="text-muted-foreground font-medium"> × FoodSecure</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleLang}
            className="text-xs font-semibold px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
          >
            {lang === "bm" ? "EN" : "BM"}
          </button>
          {user && (
            <button
              onClick={signOut}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              title="Log keluar"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
