import { useI18n } from "@/lib/i18n";
import type { FoodItem } from "@/lib/data";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export function PriceCard({ item }: { item: FoodItem }) {
  const { lang, t } = useI18n();
  const change = ((item.currentPrice - item.previousPrice) / item.previousPrice) * 100;
  const isUp = change > 1;
  const isDown = change < -1;

  const unitLabel = item.unit === "kg" ? t("perKg") : item.unit === "L" ? t("perLitre") : t("perUnit");

  return (
    <div className="rounded-xl bg-card p-3 card-shadow transition-shadow hover:card-shadow-hover">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground truncate">{item.name[lang]}</p>
          <p className="text-lg font-bold tabular-nums text-foreground mt-0.5">
            RM{item.currentPrice.toFixed(2)}
            <span className="text-[11px] font-normal text-muted-foreground">{unitLabel}</span>
          </p>
        </div>
        <div className={`flex items-center gap-0.5 text-xs font-semibold tabular-nums ${
          isUp ? "text-destructive" : isDown ? "text-primary" : "text-muted-foreground"
        }`}>
          {isUp ? <TrendingUp className="h-3.5 w-3.5" /> : isDown ? <TrendingDown className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
          {change >= 0 ? "+" : ""}{change.toFixed(1)}%
        </div>
      </div>
      {/* Mini sparkline */}
      <div className="flex items-end gap-[3px] mt-2 h-6">
        {item.trend.map((val, i) => {
          const max = Math.max(...item.trend);
          const min = Math.min(...item.trend);
          const range = max - min || 1;
          const height = ((val - min) / range) * 100;
          const isLast = i === item.trend.length - 1;
          return (
            <div
              key={i}
              className={`flex-1 rounded-sm transition-all ${
                isLast ? (isUp ? "bg-destructive" : isDown ? "bg-primary" : "bg-muted-foreground") : "bg-muted"
              }`}
              style={{ height: `${Math.max(height, 10)}%` }}
            />
          );
        })}
      </div>
      <p className="text-[10px] text-muted-foreground mt-1 tabular-nums">
        {t("nationalAvg")}: RM{item.nationalAvg.toFixed(2)}
      </p>
    </div>
  );
}
