import { useState } from "react";
import { I18nProvider } from "@/lib/i18n";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { DashboardView } from "@/components/DashboardView";
import { PantryPanel } from "@/components/PantryPanel";
import { RecipesView } from "@/components/RecipesView";
import { CommunityView } from "@/components/CommunityView";

function AppContent() {
  const [tab, setTab] = useState("dashboard");
  const [pantry, setPantry] = useState<string[]>([]);

  return (
    <div className="min-h-screen bg-background pb-16">
      <TopBar />
      <main className="max-w-lg mx-auto px-4 py-4">
        {tab === "dashboard" && <DashboardView />}
        {tab === "pantry" && <PantryPanel pantry={pantry} setPantry={setPantry} />}
        {tab === "recipes" && <RecipesView pantry={pantry} />}
        {tab === "community" && <CommunityView />}
      </main>
      <BottomNav active={tab} onNavigate={setTab} />
    </div>
  );
}

export default function Index() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}
