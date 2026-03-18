import { useI18n } from "@/lib/i18n";
import type { Disruption, FoodItem } from "@/lib/contracts";
import { PriceCard } from "./PriceCard";
import { PriceAlertCard } from "./PriceAlertCard";
import { motion } from "framer-motion";

const ease = [0.2, 0, 0, 1] as const;
const fadeIn = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.15, ease: ease as unknown as [number, number, number, number] },
};

interface DashboardViewProps {
  foodItems: FoodItem[];
  disruptions: Disruption[];
}

export function DashboardView({ foodItems, disruptions }: DashboardViewProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-5">
      <section aria-live="polite">
        <h2 className="text-sm font-bold text-foreground mb-2">{t("supplyDisruptions")}</h2>
        <div className="space-y-2">
          {disruptions.map((d, i) => (
            <motion.div key={d.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15, delay: i * 0.05 }}>
              <PriceAlertCard alert={d} />
            </motion.div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold text-foreground mb-2">{t("essentialPrices")}</h2>
        <div className="grid grid-cols-2 gap-2">
          {foodItems.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15, delay: i * 0.03 }}>
              <PriceCard item={item} />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
