import { Activity, AlertTriangle, CircleGauge, Crosshair } from "lucide-react";
import { formatCurrencyCompact, formatNumberCompact, formatPercent } from "@/lib/format";
import type { ScannerSignal } from "@/lib/analytics/types";

const signalLabels: Record<ScannerSignal["type"], string> = {
  HIGH_VOLUME_OI: "High Volume / OI",
  HIGH_PREMIUM: "High Premium Proxy",
  HIGH_GEX: "High Gamma Exposure",
  HIGH_IV: "High IV",
  TIGHT_SPREAD: "Tight Spread",
  NEAR_ATM: "Near At-the-Money",
  LARGE_PUT_CONCENTRATION: "Large Put Concentration",
  LARGE_CALL_CONCENTRATION: "Large Call Concentration"
};

const severityRank: Record<ScannerSignal["severity"], number> = {
  high: 0,
  medium: 1,
  low: 2
};

function formatSignalValue(row: ScannerSignal): string {
  if (row.value == null) return "n/a";
  if (row.type === "HIGH_PREMIUM" || row.type === "HIGH_GEX") return formatCurrencyCompact(row.value);
  if (row.type === "HIGH_IV" || row.type === "TIGHT_SPREAD") return formatPercent(row.value);
  if (row.type === "HIGH_VOLUME_OI") return `${row.value.toFixed(2)}x`;
  return formatNumberCompact(row.value);
}

export function ScannerPanel({ rows }: { rows: ScannerSignal[] }) {
  const sortedRows = [...rows].sort(
    (a, b) => severityRank[a.severity] - severityRank[b.severity] || signalLabels[a.type].localeCompare(signalLabels[b.type])
  );
  const highCount = rows.filter((row) => row.severity === "high").length;
  const mediumCount = rows.filter((row) => row.severity === "medium").length;
  const lowCount = rows.filter((row) => row.severity === "low").length;

  return (
    <section className="panel scanner-panel">
      <div className="scanner-header">
        <div>
          <h3>Scanner Signals</h3>
          <p className="muted">Signals are calculated from the currently loaded option chain only.</p>
        </div>
        <div className="scanner-total">
          <Activity size={16} />
          <strong>{rows.length}</strong>
          <span>signals</span>
        </div>
      </div>

      <div className="scanner-summary">
        <div className="scanner-summary-card high">
          <AlertTriangle size={16} />
          <span>High</span>
          <strong>{highCount}</strong>
        </div>
        <div className="scanner-summary-card medium">
          <CircleGauge size={16} />
          <span>Medium</span>
          <strong>{mediumCount}</strong>
        </div>
        <div className="scanner-summary-card low">
          <Crosshair size={16} />
          <span>Low</span>
          <strong>{lowCount}</strong>
        </div>
      </div>

      {!sortedRows.length ? (
        <div className="scanner-empty">
          <Crosshair size={18} />
          <div>
            <strong>No scanner signals on the loaded chain.</strong>
            <p className="muted">Try another symbol or wait for the next refresh.</p>
          </div>
        </div>
      ) : (
        <div className="scanner-list">
          {sortedRows.map((row, index) => (
            <article className={`scanner-card severity-${row.severity}`} key={`${row.type}-${row.contractSymbol}-${index}`}>
              <div className="scanner-card-main">
                <div className="scanner-card-title">
                  <span className={`severity-pill severity-${row.severity}`}>{row.severity}</span>
                  <strong>{signalLabels[row.type]}</strong>
                </div>
                <p>{row.message}</p>
                <div className="scanner-meta">
                  <span>{row.contractSymbol ?? row.symbol}</span>
                  <span>{row.symbol}</span>
                </div>
              </div>
              <div className="scanner-value">
                <span>Value</span>
                <strong>{formatSignalValue(row)}</strong>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
