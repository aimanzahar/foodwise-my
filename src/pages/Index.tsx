import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { I18nProvider } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { usePantry } from "@/hooks/usePantry";
import { useBootstrap } from "@/hooks/useBootstrap";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { PriceView } from "@/components/PriceView";
import { PantryRecipeView } from "@/components/PantryRecipeView";
import { DisruptionView } from "@/components/DisruptionView";
import { Loader2 } from "lucide-react";

function AppContent() {
  const [tab, setTab] = useState("harga");
  const { data, isLoading, isError } = useBootstrap();
  const { pantry, addItem, removeItem, updateItem, loading: pantryLoading } = usePantry();
  const { signOut } = useAuth();

  useEffect(() => {
    if (isError) {
      signOut();
    }
  }, [isError, signOut]);

  if (isLoading || pantryLoading || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      <TopBar />
      <main className="max-w-lg mx-auto px-4 py-4">
        {tab === "harga" && (
          <PriceView foodItems={data.foodItems} />
        )}
        {tab === "pantri" && (
          <PantryRecipeView
            pantry={pantry}
            commonIngredients={data.commonIngredients}
            recipes={data.recipes}
            communityRecipes={data.communityRecipes}
            onAddPantryItem={addItem}
            onRemovePantryItem={removeItem}
            onUpdatePantryItem={updateItem}
          />
        )}
        {tab === "gangguan" && (
          <DisruptionView disruptions={data.disruptions} />
        )}
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
