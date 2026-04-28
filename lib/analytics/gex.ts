import type { GexStrikeRow } from "@/lib/analytics/types";
import type { NormalizedOptionContract } from "@/lib/provider/types";

export function calculateContractGex(contract: NormalizedOptionContract, underlyingPrice: number): number {
  if (!Number.isFinite(underlyingPrice) || underlyingPrice <= 0) {
    throw new Error("INVALID_UNDERLYING_PRICE");
  }
  if (contract.gamma == null) return 0;
  const sign = contract.optionType === "call" ? 1 : -1;
  return contract.gamma * (contract.openInterest || 0) * (contract.multiplier || 100) * underlyingPrice ** 2 * 0.01 * sign;
}

export function calculateGexByStrike(
  contracts: NormalizedOptionContract[],
  underlyingPrice: number
): GexStrikeRow[] {
  const rows = new Map<number, GexStrikeRow>();
  for (const contract of contracts) {
    if (contract.gamma == null) continue;
    const row =
      rows.get(contract.strike) ??
      {
        strike: contract.strike,
        callGex: 0,
        putGex: 0,
        netGex: 0,
        callOpenInterest: 0,
        putOpenInterest: 0,
        callVolume: 0,
        putVolume: 0
      };
    const gex = calculateContractGex(contract, underlyingPrice);
    if (contract.optionType === "call") {
      row.callGex += gex;
      row.callOpenInterest += contract.openInterest || 0;
      row.callVolume += contract.dayVolume || 0;
    } else {
      row.putGex += gex;
      row.putOpenInterest += contract.openInterest || 0;
      row.putVolume += contract.dayVolume || 0;
    }
    row.netGex = row.callGex + row.putGex;
    rows.set(contract.strike, row);
  }
  return [...rows.values()].sort((a, b) => a.strike - b.strike);
}
