import { PremiumHeatmap } from "@/components/charts/PremiumHeatmap";
import type { FlowProxyRow } from "@/lib/analytics/flowProxy";

export function IntradayActivityChart({ rows }: { rows: FlowProxyRow[] }) {
  return <PremiumHeatmap rows={rows} />;
}
