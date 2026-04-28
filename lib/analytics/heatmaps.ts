import { calculateContractDex } from "@/lib/analytics/dex";
import { calculateContractGex } from "@/lib/analytics/gex";
import { getPremiumProxy } from "@/lib/analytics/price";
import type { NormalizedOptionContract } from "@/lib/provider/types";

export type HeatmapType = "volume" | "openInterest" | "premium" | "gex" | "dex" | "iv";

export interface HeatmapCell {
  strike: number;
  expirationDate: string;
  value: number;
}

export function buildHeatmap(
  contracts: NormalizedOptionContract[],
  underlyingPrice: number,
  type: HeatmapType
): HeatmapCell[] {
  const cells = new Map<string, HeatmapCell>();
  for (const contract of contracts) {
    const key = `${contract.expirationDate}:${contract.strike}`;
    const cell = cells.get(key) ?? { strike: contract.strike, expirationDate: contract.expirationDate, value: 0 };
    if (type === "volume") cell.value += contract.optionType === "call" ? contract.dayVolume : -contract.dayVolume;
    if (type === "openInterest") cell.value += contract.optionType === "call" ? contract.openInterest : -contract.openInterest;
    if (type === "premium") cell.value += contract.optionType === "call" ? getPremiumProxy(contract) : -getPremiumProxy(contract);
    if (type === "gex") cell.value += calculateContractGex(contract, underlyingPrice);
    if (type === "dex") cell.value += calculateContractDex(contract, underlyingPrice);
    if (type === "iv") cell.value += contract.impliedVolatility ?? 0;
    cells.set(key, cell);
  }
  return [...cells.values()].sort((a, b) => a.expirationDate.localeCompare(b.expirationDate) || a.strike - b.strike);
}
