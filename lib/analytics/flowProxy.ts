import { getPremiumProxy } from "@/lib/analytics/price";
import type { NormalizedOptionContract } from "@/lib/provider/types";

export interface FlowProxyRow {
  strike: number;
  callPremiumProxy: number;
  putPremiumProxy: number;
  netPremiumProxy: number;
  callVolume: number;
  putVolume: number;
}

export type AggressorEstimate = "Likely Buyer Initiated" | "Likely Seller Initiated" | "Unknown Direction";

export function estimateAggressor(contract: NormalizedOptionContract): AggressorEstimate {
  if (contract.last == null || contract.bid == null || contract.ask == null) return "Unknown Direction";
  if (contract.last >= contract.ask) return "Likely Buyer Initiated";
  if (contract.last <= contract.bid) return "Likely Seller Initiated";
  return "Unknown Direction";
}

export function calculateFlowProxyByStrike(contracts: NormalizedOptionContract[]): FlowProxyRow[] {
  const rows = new Map<number, FlowProxyRow>();
  for (const contract of contracts) {
    const row =
      rows.get(contract.strike) ??
      { strike: contract.strike, callPremiumProxy: 0, putPremiumProxy: 0, netPremiumProxy: 0, callVolume: 0, putVolume: 0 };
    if (contract.optionType === "call") {
      row.callPremiumProxy += getPremiumProxy(contract);
      row.callVolume += contract.dayVolume;
    } else {
      row.putPremiumProxy -= getPremiumProxy(contract);
      row.putVolume += contract.dayVolume;
    }
    row.netPremiumProxy = row.callPremiumProxy + row.putPremiumProxy;
    rows.set(contract.strike, row);
  }
  return [...rows.values()].sort((a, b) => a.strike - b.strike);
}
