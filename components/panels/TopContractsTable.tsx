import { formatCurrencyCompact, formatNumberCompact, formatPercent } from "@/lib/format";
import type { TopContractRow } from "@/lib/analytics/types";

export function TopContractsTable({ rows }: { rows: TopContractRow[] }) {
  return (
    <section className="panel">
      <h3>Top Contracts</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Contract</th>
            <th>Type</th>
            <th>Strike</th>
            <th>Mid</th>
            <th>Vol</th>
            <th>OI</th>
            <th>Vol/OI</th>
            <th>IV</th>
            <th>Premium Proxy</th>
            <th>GEX</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.contractSymbol}>
              <td>{row.contractSymbol}</td>
              <td>{row.optionType}</td>
              <td>{row.strike}</td>
              <td>{row.mid.toFixed(2)}</td>
              <td>{formatNumberCompact(row.volume)}</td>
              <td>{formatNumberCompact(row.openInterest)}</td>
              <td>{row.volumeOiRatio.toFixed(2)}x</td>
              <td>{formatPercent(row.impliedVolatility)}</td>
              <td>{formatCurrencyCompact(row.premiumProxy)}</td>
              <td>{formatCurrencyCompact(row.gex)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
