import type { DealerLevels } from "@/lib/analytics/types";

const dealerLevelLabels: Record<keyof DealerLevels, string> = {
  callWall: "Call Wall",
  putWall: "Put Wall",
  maxPositiveGammaStrike: "Strongest Positive Gamma",
  maxNegativeGammaStrike: "Strongest Negative Gamma",
  zeroGammaApprox: "Zero Gamma Approx.",
  highVolumeStrike: "Highest Volume Strike",
  highOiStrike: "Highest Open Interest Strike",
  atmStrike: "Nearest At-the-Money Strike",
  expectedMoveProxy: "Expected Move Proxy"
};

const dealerLevelOrder: (keyof DealerLevels)[] = [
  "callWall",
  "putWall",
  "zeroGammaApprox",
  "maxPositiveGammaStrike",
  "maxNegativeGammaStrike",
  "highVolumeStrike",
  "highOiStrike",
  "atmStrike",
  "expectedMoveProxy"
];

export function DealerLevelsPanel({ levels }: { levels: DealerLevels }) {
  return (
    <section className="panel">
      <h3>Dealer Levels</h3>
      <table className="table">
        <tbody>
          {dealerLevelOrder.map((key) => {
            const value = levels[key];
            return (
            <tr key={key}>
              <td>{dealerLevelLabels[key]}</td>
              <td>{typeof value === "number" ? value.toFixed(2) : "n/a"}</td>
            </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
