import type { ScannerSignal } from "@/lib/analytics/types";
import { calculateContractGex } from "@/lib/analytics/gex";
import { getPremiumProxy } from "@/lib/analytics/price";
import type { NormalizedOptionContract } from "@/lib/provider/types";

export function runScanner(contracts: NormalizedOptionContract[], underlyingPrice: number): ScannerSignal[] {
  const signals: ScannerSignal[] = [];
  for (const contract of contracts) {
    const volumeOi = contract.openInterest ? contract.dayVolume / contract.openInterest : contract.dayVolume;
    const premium = getPremiumProxy(contract);
    const gex = calculateContractGex(contract, underlyingPrice);
    if (volumeOi >= 2) {
      signals.push({
        type: "HIGH_VOLUME_OI",
        severity: volumeOi >= 5 ? "high" : "medium",
        symbol: contract.underlyingSymbol,
        contractSymbol: contract.symbol,
        message: `Volume/OI is ${volumeOi.toFixed(1)}x on ${contract.underlyingSymbol} ${contract.strike}${contract.optionType[0].toUpperCase()}`,
        value: volumeOi
      });
    }
    if (premium >= 1_000_000) {
      signals.push({
        type: "HIGH_PREMIUM",
        severity: premium >= 5_000_000 ? "high" : "medium",
        symbol: contract.underlyingSymbol,
        contractSymbol: contract.symbol,
        message: `Premium proxy is elevated on ${contract.symbol}.`,
        value: premium
      });
    }
    if (Math.abs(gex) >= 5_000_000) {
      signals.push({
        type: "HIGH_GEX",
        severity: Math.abs(gex) >= 25_000_000 ? "high" : "medium",
        symbol: contract.underlyingSymbol,
        contractSymbol: contract.symbol,
        message: `Large gamma exposure proxy at ${contract.strike}.`,
        value: gex
      });
    }
    if ((contract.impliedVolatility ?? 0) >= 0.6) {
      signals.push({
        type: "HIGH_IV",
        severity: "medium",
        symbol: contract.underlyingSymbol,
        contractSymbol: contract.symbol,
        message: `IV is high on ${contract.symbol}.`,
        value: contract.impliedVolatility ?? undefined
      });
    }
    if (Math.abs(contract.strike - underlyingPrice) / underlyingPrice <= 0.01) {
      signals.push({
        type: "NEAR_ATM",
        severity: "low",
        symbol: contract.underlyingSymbol,
        contractSymbol: contract.symbol,
        message: `${contract.symbol} is near the current underlying price.`,
        value: contract.strike
      });
    }
  }
  return signals.slice(0, 40);
}
