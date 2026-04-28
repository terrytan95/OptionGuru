import { VolumeOiHeatmap } from "@/components/charts/VolumeOiHeatmap";
import type { GexStrikeRow } from "@/lib/analytics/types";

export function OiByStrikeChart({ rows }: { rows: GexStrikeRow[] }) {
  return <VolumeOiHeatmap rows={rows} />;
}
