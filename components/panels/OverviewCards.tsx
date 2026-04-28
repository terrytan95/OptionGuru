import { formatCurrencyCompact, formatNumberCompact, formatPercent, formatPrice } from "@/lib/format";
import type { DashboardPayload } from "@/lib/services/optionsDashboardService";

export function OverviewCards({ payload }: { payload: DashboardPayload }) {
  const totalNetGex = payload.gexRows.reduce((sum, row) => sum + row.netGex, 0);
  const metrics = [
    ["Underlying", formatPrice(payload.snapshot.underlyingPrice)],
    ["Call Volume", formatNumberCompact(payload.summary.totalCallVolume)],
    ["Put Volume", formatNumberCompact(payload.summary.totalPutVolume)],
    ["C/P Volume", payload.summary.callPutVolumeRatio?.toFixed(2) ?? "n/a"],
    ["Call OI", formatNumberCompact(payload.summary.totalCallOpenInterest)],
    ["Put OI", formatNumberCompact(payload.summary.totalPutOpenInterest)],
    ["Net Premium Proxy", formatCurrencyCompact(payload.summary.netPremiumProxy)],
    ["Net GEX 1%", formatCurrencyCompact(totalNetGex)],
    ["Average IV", formatPercent(payload.summary.averageIv)],
    ["Call Wall", payload.levels.callWall?.toString() ?? "n/a"],
    ["Put Wall", payload.levels.putWall?.toString() ?? "n/a"],
    ["Zero Gamma", payload.levels.zeroGammaApprox?.toFixed(2) ?? "n/a"]
  ];
  return (
    <div className="grid cols-4">
      {metrics.map(([label, value]) => (
        <section className="panel metric" key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </section>
      ))}
    </div>
  );
}
