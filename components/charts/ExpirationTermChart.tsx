import { formatCurrencyCompact, formatNumberCompact, formatPercent } from "@/lib/format";
import type { ExpirationRow } from "@/lib/analytics/expirations";

export function ExpirationTermChart({ rows }: { rows: ExpirationRow[] }) {
  return (
    <section className="panel">
      <h3>Expiration Analysis</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Expiration</th>
            <th>Volume</th>
            <th>OI</th>
            <th>Premium Proxy</th>
            <th>GEX</th>
            <th>Avg IV</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.expirationDate}>
              <td>{row.expirationDate}</td>
              <td>{formatNumberCompact(row.totalVolume)}</td>
              <td>{formatNumberCompact(row.totalOpenInterest)}</td>
              <td>{formatCurrencyCompact(row.totalPremiumProxy)}</td>
              <td>{formatCurrencyCompact(row.totalGex)}</td>
              <td>{formatPercent(row.averageIv)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
