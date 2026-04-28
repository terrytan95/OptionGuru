import type { GreekExposureRow } from "@/lib/analytics/types";
import { calculateContractDex } from "@/lib/analytics/dex";
import { calculateContractGex } from "@/lib/analytics/gex";
import type { NormalizedOptionContract } from "@/lib/provider/types";

export function calculateGreekExposureByStrike(
  contracts: NormalizedOptionContract[],
  underlyingPrice: number
): GreekExposureRow[] {
  const rows = new Map<number, GreekExposureRow>();
  for (const contract of contracts) {
    const row = rows.get(contract.strike) ?? { strike: contract.strike, dex: 0, gex: 0, vex: 0, tex: 0 };
    row.dex += calculateContractDex(contract, underlyingPrice);
    row.gex += calculateContractGex(contract, underlyingPrice);
    row.vex += (contract.vega ?? 0) * (contract.openInterest || 0) * (contract.multiplier || 100);
    row.tex += (contract.theta ?? 0) * (contract.openInterest || 0) * (contract.multiplier || 100);
    rows.set(contract.strike, row);
  }
  return [...rows.values()].sort((a, b) => a.strike - b.strike);
}
