import { useI18n } from "@/lib/i18n";
import type { Disruption } from "@/lib/contracts";
import { PriceAlertCard } from "./PriceAlertCard";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface DisruptionViewProps {
  disruptions: Disruption[];
}

export function DisruptionView({ disruptions }: DisruptionViewProps) {
  const { t } = useI18n();

  const high = disruptions.filter((d) => d.severity === "high");
  const medium = disruptions.filter((d) => d.severity === "medium");
  const low = disruptions.filter((d) => d.severity === "low");

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-warning" />
        <div>
          <h2 className="text-base font-bold text-foreground">{t("disruptionCentre")}</h2>
          <p className="text-xs text-muted-foreground">
            {disruptions.length} {t("activeDisruptions").toLowerCase()}
          </p>
        </div>
      </div>

      {/* Summary bar */}
      <div className="flex gap-2">
        <div className="flex-1 rounded-xl bg-destructive/10 p-2.5 text-center">
          <p className="text-lg font-bold text-destructive tabular-nums">{high.length}</p>
          <p className="text-[10px] font-medium text-destructive">{t("highSeverity")}</p>
        </div>
        <div className="flex-1 rounded-xl bg-warning/10 p-2.5 text-center">
          <p className="text-lg font-bold text-warning tabular-nums">{medium.length}</p>
          <p className="text-[10px] font-medium text-warning">{t("medSeverity")}</p>
        </div>
        <div className="flex-1 rounded-xl bg-accent/10 p-2.5 text-center">
          <p className="text-lg font-bold text-accent tabular-nums">{low.length}</p>
          <p className="text-[10px] font-medium text-accent">{t("lowSeverity")}</p>
        </div>
      </div>

      {/* Disruption list sorted by severity */}
      <div className="space-y-2">
        {[...high, ...medium, ...low].map((d, i) => (
          <motion.div
            key={d.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, delay: i * 0.05 }}
          >
            <PriceAlertCard alert={d} />
          </motion.div>
        ))}
      </div>

      {disruptions.length === 0 && (
        <div className="rounded-xl bg-card p-8 card-shadow text-center">
          <p className="text-sm text-muted-foreground">
            {t("supplyDisruptions")} — Tiada gangguan aktif
          </p>
        </div>
      )}
    </div>
  );
}
