import type { TopContractRow } from "@/lib/analytics/types";
import { calculateContractDex } from "@/lib/analytics/dex";
import { calculateContractGex } from "@/lib/analytics/gex";
import { getMidPrice, getPremiumProxy } from "@/lib/analytics/price";
import type { NormalizedOptionContract } from "@/lib/provider/types";

export type TopContractRankBy = "premium" | "volume" | "volumeOi" | "gex" | "dex" | "iv" | "spread";

export function toTopContractRows(
  contracts: NormalizedOptionContract[],
  underlyingPrice: number
): TopContractRow[] {
  return contracts.map((contract) => {
    const mid = getMidPrice(contract);
    const spreadPercent =
      contract.bid != null && contract.ask != null && mid > 0 ? (contract.ask - contract.bid) / mid : null;
    return {
      contractSymbol: contract.symbol,
      underlyingSymbol: contract.underlyingSymbol,
      optionType: contract.optionType,
      expirationDate: contract.expirationDate,
      strike: contract.strike,
      bid: contract.bid,
      ask: contract.ask,
      last: contract.last,
      mid,
      volume: contract.dayVolume || 0,
      openInterest: contract.openInterest || 0,
      volumeOiRatio: contract.openInterest ? (contract.dayVolume || 0) / contract.openInterest : contract.dayVolume || 0,
      impliedVolatility: contract.impliedVolatility,
      delta: contract.delta,
      gamma: contract.gamma,
      premiumProxy: getPremiumProxy(contract),
      gex: calculateContractGex(contract, underlyingPrice),
      dex: calculateContractDex(contract, underlyingPrice),
      spreadPercent
    };
  });
}

export function getTopContracts(
  contracts: NormalizedOptionContract[],
  underlyingPrice: number,
  rankBy: TopContractRankBy = "premium",
  limit = 20
): TopContractRow[] {
  const rows = toTopContractRows(contracts, underlyingPrice);
  const pick = (row: TopContractRow): number => {
    if (rankBy === "volume") return row.volume;
    if (rankBy === "volumeOi") return row.volumeOiRatio;
    if (rankBy === "gex") return Math.abs(row.gex);
    if (rankBy === "dex") return Math.abs(row.dex);
    if (rankBy === "iv") return row.impliedVolatility ?? 0;
    if (rankBy === "spread") return row.spreadPercent == null ? Number.POSITIVE_INFINITY : -row.spreadPercent;
    return row.premiumProxy;
  };
  return rows.sort((a, b) => pick(b) - pick(a)).slice(0, limit);
}
