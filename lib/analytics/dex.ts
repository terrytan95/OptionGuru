import type { NormalizedOptionContract } from "@/lib/provider/types";

export function calculateContractDex(contract: NormalizedOptionContract, underlyingPrice: number): number {
  if (!Number.isFinite(underlyingPrice) || underlyingPrice <= 0) {
    throw new Error("INVALID_UNDERLYING_PRICE");
  }
  if (contract.delta == null) return 0;
  return contract.delta * (contract.openInterest || 0) * (contract.multiplier || 100) * underlyingPrice;
}
