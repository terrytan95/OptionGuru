import { formatNumberCompact } from "@/lib/format";
import type { ScannerSignal } from "@/lib/analytics/types";

export function ScannerPanel({ rows }: { rows: ScannerSignal[] }) {
  return (
    <section className="panel">
      <h3>Scanner Signals</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Signal</th>
            <th>Severity</th>
            <th>Contract</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row.type}-${row.contractSymbol}-${index}`}>
              <td>{row.message}</td>
              <td>{row.severity}</td>
              <td>{row.contractSymbol ?? row.symbol}</td>
              <td>{row.value == null ? "" : formatNumberCompact(row.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
