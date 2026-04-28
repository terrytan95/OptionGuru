import type { NormalizedOptionContract } from "@/lib/provider/types";

export function contract(overrides: Partial<NormalizedOptionContract> = {}): NormalizedOptionContract {
  return {
    symbol: "O:SPY260427C00520000",
    underlyingSymbol: "SPY",
    expirationDate: "2026-04-27",
    strike: 520,
    optionType: "call",
    gamma: 0.01,
    delta: 0.5,
    theta: -0.02,
    vega: 0.1,
    impliedVolatility: 0.2,
    openInterest: 100,
    dayVolume: 50,
    bid: 1,
    ask: 1.2,
    bidSize: 1,
    askSize: 1,
    last: 1.1,
    lastSize: 1,
    multiplier: 100,
    ...overrides
  };
}
