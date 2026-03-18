import { useState } from "react";
import { Navigate } from "react-router-dom";
import { I18nProvider } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { usePantry } from "@/hooks/usePantry";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { DashboardView } from "@/components/DashboardView";
import { PantryPanel } from "@/components/PantryPanel";
import { RecipesView } from "@/components/RecipesView";
import { CommunityView } from "@/components/CommunityView";
import { Loader2 } from "lucide-react";

function AppContent() {
  const [tab, setTab] = useState("dashboard");
  const { pantry, toggleItem, loading: pantryLoading } = usePantry();

  return (
    <div className="min-h-screen bg-background pb-16">
      <TopBar />
      <main className="max-w-lg mx-auto px-4 py-4">
        {tab === "dashboard" && <DashboardView />}
        {tab === "pantry" && <PantryPanel pantry={pantry} toggleItem={toggleItem} />}
        {tab === "recipes" && <RecipesView pantry={pantry} />}
        {tab === "community" && <CommunityView />}
      </main>
      <BottomNav active={tab} onNavigate={setTab} />
    </div>
  );
}

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}
