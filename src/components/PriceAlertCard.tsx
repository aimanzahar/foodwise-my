import { useI18n } from "@/lib/i18n";
import type { Disruption } from "@/lib/data";

const severityStyles = {
  high: "bg-destructive",
  medium: "bg-warning",
  low: "bg-accent",
};

export function PriceAlertCard({ alert }: { alert: Disruption }) {
  const { lang, t } = useI18n();
  const severityLabel = alert.severity === "high" ? t("highSeverity") : alert.severity === "medium" ? t("medSeverity") : t("lowSeverity");

  return (
    <div className="relative overflow-hidden rounded-xl bg-card p-4 card-shadow transition-shadow hover:card-shadow-hover">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${severityStyles[alert.severity]} ${alert.severity === "high" ? "animate-pulse" : ""}`} />
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            {t("spike")}: {alert.item[lang]}
          </h3>
        </div>
        <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded ${
          alert.severity === "high" ? "bg-destructive/10 text-destructive" : alert.severity === "medium" ? "bg-warning/10 text-warning" : "bg-accent/10 text-accent"
        }`}>
          {severityLabel}
        </span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground text-pretty">
        {alert.region}: {alert.description[lang]}
      </p>
      <p className="mt-1 text-[11px] text-muted-foreground tabular-nums">{alert.date}</p>
    </div>
  );
}
