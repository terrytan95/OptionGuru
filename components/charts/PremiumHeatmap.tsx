import { formatCurrencyCompact } from "@/lib/format";
import type { FlowProxyRow } from "@/lib/analytics/flowProxy";

export function PremiumHeatmap({ rows }: { rows: FlowProxyRow[] }) {
  const max = Math.max(1, ...rows.map((row) => Math.abs(row.netPremiumProxy)));
  return (
    <section className="panel">
      <h3>Premium Proxy by Strike</h3>
      {rows.map((row) => (
        <div className="bar-row" key={row.strike}>
          <span>{row.strike}</span>
          <div className="bar-track">
            <div
              className={`bar-fill ${row.netPremiumProxy >= 0 ? "positive" : "negative"}`}
              style={{ width: `${Math.max(2, (Math.abs(row.netPremiumProxy) / max) * 100)}%` }}
            />
          </div>
          <span>{formatCurrencyCompact(row.netPremiumProxy)}</span>
        </div>
      ))}
    </section>
  );
}
