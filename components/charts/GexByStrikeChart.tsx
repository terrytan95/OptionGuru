import { formatCurrencyCompact } from "@/lib/format";
import type { GexStrikeRow } from "@/lib/analytics/types";

export function GexByStrikeChart({ rows }: { rows: GexStrikeRow[] }) {
  const max = Math.max(1, ...rows.map((row) => Math.abs(row.netGex)));
  return (
    <section className="panel">
      <h3>GEX by Strike</h3>
      {rows.map((row) => (
        <div className="bar-row" key={row.strike}>
          <span>{row.strike}</span>
          <div className="bar-track">
            <div
              className={`bar-fill ${row.netGex >= 0 ? "positive" : "negative"}`}
              style={{ width: `${Math.max(2, (Math.abs(row.netGex) / max) * 100)}%` }}
            />
          </div>
          <span>{formatCurrencyCompact(row.netGex)}</span>
        </div>
      ))}
    </section>
  );
}
