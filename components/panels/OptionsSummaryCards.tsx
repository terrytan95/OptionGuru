import { formatCurrencyCompact, formatNumberCompact, formatPercent } from "@/lib/format";
import type { OptionsSummary } from "@/lib/analytics/types";

export function OptionsSummaryCards({ summary }: { summary: OptionsSummary }) {
  return (
    <section className="panel">
      <h3>Options Summary</h3>
      <div className="grid cols-3">
        <div className="metric">
          <span>Total Volume</span>
          <strong>{formatNumberCompact(summary.totalCallVolume + summary.totalPutVolume)}</strong>
        </div>
        <div className="metric">
          <span>Net Premium Proxy</span>
          <strong>{formatCurrencyCompact(summary.netPremiumProxy)}</strong>
        </div>
        <div className="metric">
          <span>ATM IV</span>
          <strong>{formatPercent(summary.atmIv)}</strong>
        </div>
      </div>
    </section>
  );
}
