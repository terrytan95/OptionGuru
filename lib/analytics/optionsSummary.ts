import type { OptionsSummary } from "@/lib/analytics/types";
import { getPremiumProxy } from "@/lib/analytics/price";
import type { NormalizedOptionContract } from "@/lib/provider/types";

export function calculateOptionsSummary(
  contracts: NormalizedOptionContract[],
  underlyingPrice: number
): OptionsSummary {
  let totalCallVolume = 0;
  let totalPutVolume = 0;
  let totalCallOpenInterest = 0;
  let totalPutOpenInterest = 0;
  let callPremiumProxy = 0;
  let putPremiumProxy = 0;
  const ivs: number[] = [];
  let highestVolumeStrike: number | null = null;
  let highestOiStrike: number | null = null;
  let maxVolume = -1;
  let maxOi = -1;
  let atmContract: NormalizedOptionContract | null = null;

  for (const contract of contracts) {
    const volume = contract.dayVolume || 0;
    const oi = contract.openInterest || 0;
    if (contract.optionType === "call") {
      totalCallVolume += volume;
      totalCallOpenInterest += oi;
      callPremiumProxy += getPremiumProxy(contract);
    } else {
      totalPutVolume += volume;
      totalPutOpenInterest += oi;
      putPremiumProxy -= getPremiumProxy(contract);
    }
    if (contract.impliedVolatility != null) ivs.push(contract.impliedVolatility);
    if (volume > maxVolume) {
      maxVolume = volume;
      highestVolumeStrike = contract.strike;
    }
    if (oi > maxOi) {
      maxOi = oi;
      highestOiStrike = contract.strike;
    }
    if (!atmContract || Math.abs(contract.strike - underlyingPrice) < Math.abs(atmContract.strike - underlyingPrice)) {
      atmContract = contract;
    }
  }

  return {
    totalCallVolume,
    totalPutVolume,
    callPutVolumeRatio: totalPutVolume ? totalCallVolume / totalPutVolume : null,
    totalCallOpenInterest,
    totalPutOpenInterest,
    callPutOpenInterestRatio: totalPutOpenInterest ? totalCallOpenInterest / totalPutOpenInterest : null,
    callPremiumProxy,
    putPremiumProxy,
    netPremiumProxy: callPremiumProxy + putPremiumProxy,
    averageIv: ivs.length ? ivs.reduce((sum, iv) => sum + iv, 0) / ivs.length : null,
    atmIv: atmContract?.impliedVolatility ?? null,
    highestVolumeStrike,
    highestOiStrike
  };
}
