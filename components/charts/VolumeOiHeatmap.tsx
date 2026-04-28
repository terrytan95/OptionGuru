import { formatNumberCompact } from "@/lib/format";
import type { GexStrikeRow } from "@/lib/analytics/types";

export function VolumeOiHeatmap({ rows }: { rows: GexStrikeRow[] }) {
  return (
    <section className="panel">
      <h3>OI & Volume by Strike</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Strike</th>
            <th>Call Vol</th>
            <th>Put Vol</th>
            <th>Call OI</th>
            <th>Put OI</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.strike}>
              <td>{row.strike}</td>
              <td>{formatNumberCompact(row.callVolume)}</td>
              <td>{formatNumberCompact(row.putVolume)}</td>
              <td>{formatNumberCompact(row.callOpenInterest)}</td>
              <td>{formatNumberCompact(row.putOpenInterest)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
