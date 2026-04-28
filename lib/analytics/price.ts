import type { NormalizedOptionContract } from "@/lib/provider/types";

export function getMidPrice(contract: NormalizedOptionContract): number {
  if (
    contract.bid != null &&
    contract.ask != null &&
    contract.bid >= 0 &&
    contract.ask > 0
  ) {
    return (contract.bid + contract.ask) / 2;
  }
  if (contract.last != null && contract.last > 0) return contract.last;
  if (contract.dayClose != null && contract.dayClose > 0) return contract.dayClose;
  return 0;
}

export function getPremiumProxy(contract: NormalizedOptionContract): number {
  return getMidPrice(contract) * contract.dayVolume * (contract.multiplier || 100);
}
