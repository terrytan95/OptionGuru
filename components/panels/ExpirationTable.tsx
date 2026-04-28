import { ExpirationTermChart } from "@/components/charts/ExpirationTermChart";
import type { ExpirationRow } from "@/lib/analytics/expirations";

export function ExpirationTable({ rows }: { rows: ExpirationRow[] }) {
  return <ExpirationTermChart rows={rows} />;
}
