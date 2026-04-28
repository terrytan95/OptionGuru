import type { DealerLevels } from "@/lib/analytics/types";

export function DealerLevelsPanel({ levels }: { levels: DealerLevels }) {
  const rows = Object.entries(levels);
  return (
    <section className="panel">
      <h3>Dealer Levels</h3>
      <table className="table">
        <tbody>
          {rows.map(([key, value]) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{typeof value === "number" ? value.toFixed(2) : "n/a"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
