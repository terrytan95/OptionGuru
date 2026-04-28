import { calculateContractDex } from "@/lib/analytics/dex";
import { calculateContractGex } from "@/lib/analytics/gex";
import { getPremiumProxy } from "@/lib/analytics/price";
import type { NormalizedOptionContract } from "@/lib/provider/types";

export interface ExpirationRow {
  expirationDate: string;
  totalVolume: number;
  totalOpenInterest: number;
  totalPremiumProxy: number;
  totalGex: number;
  totalDex: number;
  averageIv: number | null;
  putCallVolumeRatio: number | null;
  putCallOpenInterestRatio: number | null;
}

export function calculateExpirationRows(
  contracts: NormalizedOptionContract[],
  underlyingPrice: number
): ExpirationRow[] {
  const grouped = new Map<string, NormalizedOptionContract[]>();
  for (const contract of contracts) {
    grouped.set(contract.expirationDate, [...(grouped.get(contract.expirationDate) ?? []), contract]);
  }
  return [...grouped.entries()]
    .map(([expirationDate, expirationContracts]) => {
      let callVolume = 0;
      let putVolume = 0;
      let callOi = 0;
      let putOi = 0;
      let totalPremiumProxy = 0;
      let totalGex = 0;
      let totalDex = 0;
      const ivs: number[] = [];
      for (const contract of expirationContracts) {
        if (contract.optionType === "call") {
          callVolume += contract.dayVolume;
          callOi += contract.openInterest;
          totalPremiumProxy += getPremiumProxy(contract);
        } else {
          putVolume += contract.dayVolume;
          putOi += contract.openInterest;
          totalPremiumProxy -= getPremiumProxy(contract);
        }
        totalGex += calculateContractGex(contract, underlyingPrice);
        totalDex += calculateContractDex(contract, underlyingPrice);
        if (contract.impliedVolatility != null) ivs.push(contract.impliedVolatility);
      }
      return {
        expirationDate,
        totalVolume: callVolume + putVolume,
        totalOpenInterest: callOi + putOi,
        totalPremiumProxy,
        totalGex,
        totalDex,
        averageIv: ivs.length ? ivs.reduce((sum, iv) => sum + iv, 0) / ivs.length : null,
        putCallVolumeRatio: callVolume ? putVolume / callVolume : null,
        putCallOpenInterestRatio: callOi ? putOi / callOi : null
      };
    })
    .sort((a, b) => a.expirationDate.localeCompare(b.expirationDate));
}
