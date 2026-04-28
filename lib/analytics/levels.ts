import type { DealerLevels, GexStrikeRow } from "@/lib/analytics/types";
import { getMidPrice } from "@/lib/analytics/price";
import type { NormalizedOptionContract } from "@/lib/provider/types";

export function calculateDealerLevels(
  rows: GexStrikeRow[],
  contracts: NormalizedOptionContract[],
  underlyingPrice: number
): DealerLevels {
  const maxBy = (pick: (row: GexStrikeRow) => number) =>
    rows.reduce<GexStrikeRow | null>((best, row) => (!best || pick(row) > pick(best) ? row : best), null);
  const minBy = (pick: (row: GexStrikeRow) => number) =>
    rows.reduce<GexStrikeRow | null>((best, row) => (!best || pick(row) < pick(best) ? row : best), null);

  let zeroGammaApprox: number | null = null;
  for (let index = 1; index < rows.length; index += 1) {
    const prev = rows[index - 1];
    const next = rows[index];
    if ((prev.netGex <= 0 && next.netGex >= 0) || (prev.netGex >= 0 && next.netGex <= 0)) {
      if (prev.netGex !== next.netGex) {
        // Simplified strike-level interpolation, not a full option repricing simulation across underlying prices.
        zeroGammaApprox =
          prev.strike + ((0 - prev.netGex) * (next.strike - prev.strike)) / (next.netGex - prev.netGex);
        break;
      }
    }
  }

  const atmStrike =
    rows.reduce<number | null>(
      (best, row) => (best == null || Math.abs(row.strike - underlyingPrice) < Math.abs(best - underlyingPrice) ? row.strike : best),
      null
    ) ?? null;
  const atmCall = contracts.find((contract) => contract.strike === atmStrike && contract.optionType === "call");
  const atmPut = contracts.find((contract) => contract.strike === atmStrike && contract.optionType === "put");

  return {
    callWall: maxBy((row) => row.callGex)?.strike ?? null,
    putWall: minBy((row) => row.putGex)?.strike ?? null,
    maxPositiveGammaStrike: maxBy((row) => row.netGex)?.strike ?? null,
    maxNegativeGammaStrike: minBy((row) => row.netGex)?.strike ?? null,
    zeroGammaApprox,
    highVolumeStrike: maxBy((row) => row.callVolume + row.putVolume)?.strike ?? null,
    highOiStrike: maxBy((row) => row.callOpenInterest + row.putOpenInterest)?.strike ?? null,
    atmStrike,
    expectedMoveProxy: atmCall && atmPut ? getMidPrice(atmCall) + getMidPrice(atmPut) : null
  };
}
