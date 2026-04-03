import { useI18n } from "@/lib/i18n";
import { BadgeDollarSign, ChefHat, AlertTriangle } from "lucide-react";

interface BottomNavProps {
  active: string;
  onNavigate: (tab: string) => void;
}

const tabs = [
  { id: "harga", icon: BadgeDollarSign, labelKey: "harga" as const },
  { id: "pantri", icon: ChefHat, labelKey: "pantriResipi" as const },
  { id: "gangguan", icon: AlertTriangle, labelKey: "gangguan" as const },
];

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  const { t } = useI18n();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card card-shadow border-t border-border">
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
        {tabs.map(({ id, icon: Icon, labelKey }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors duration-150 ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[11px] font-medium leading-none">{t(labelKey)}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
