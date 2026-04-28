import { formatCurrencyCompact } from "@/lib/format";
import type { GreekExposureRow } from "@/lib/analytics/types";

export function GreekExposureChart({ rows }: { rows: GreekExposureRow[] }) {
  return (
    <section className="panel">
      <h3>Greek Exposure</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Strike</th>
            <th>GEX</th>
            <th>DEX</th>
            <th>VEX</th>
            <th>TEX</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.strike}>
              <td>{row.strike}</td>
              <td>{formatCurrencyCompact(row.gex)}</td>
              <td>{formatCurrencyCompact(row.dex)}</td>
              <td>{formatCurrencyCompact(row.vex)}</td>
              <td>{formatCurrencyCompact(row.tex)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
