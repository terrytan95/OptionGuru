import { getCurrentMarketDate } from "@/lib/marketDate";
import type { NormalizedOptionContract, OptionChainSnapshot, OptionsDataProvider } from "@/lib/provider/types";
import { mockUnderlyingPrices, validateMockSymbol } from "@/lib/provider/mock/mockSymbols";

function optionTicker(symbol: string, expirationDate: string, optionType: "call" | "put", strike: number): string {
  const yymmdd = expirationDate.slice(2).replaceAll("-", "");
  const cp = optionType === "call" ? "C" : "P";
  return `O:${symbol}${yymmdd}${cp}${String(Math.round(strike * 1000)).padStart(8, "0")}`;
}

function getSessionAdjustedUnderlyingPrice(symbol: string, expirationDate: string): number {
  const basePrice = mockUnderlyingPrices[symbol] ?? 100;
  const symbolSeed = symbol.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const dateSeed = expirationDate.replaceAll("-", "").split("").reduce((sum, char) => sum + Number(char), 0);
  const driftPercent = ((symbolSeed + dateSeed) % 21 - 10) / 1000;
  return Number((basePrice * (1 + driftPercent)).toFixed(2));
}

function buildContracts(symbol: string, expirationDate: string, underlyingPrice: number): NormalizedOptionContract[] {
  const step = underlyingPrice > 500 ? 10 : underlyingPrice > 200 ? 5 : 2.5;
  const center = Math.round(underlyingPrice / step) * step;
  const strikes = Array.from({ length: 17 }, (_, index) => Number((center + (index - 8) * step).toFixed(2)));
  const symbolSeed = symbol.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const contracts: NormalizedOptionContract[] = [];
    for (const strike of strikes) {
      const distance = Math.abs(strike - underlyingPrice) / underlyingPrice;
      const dateSeed = expirationDate.replaceAll("-", "").split("").reduce((sum, char) => sum + Number(char), 0);
      const volumeBase = Math.max(
        50,
        Math.round((1 - Math.min(distance * 8, 0.9)) * (2200 + dateSeed * 8) + (symbolSeed % 13) * 30)
      );
      const oiBase = Math.max(100, Math.round((1 - Math.min(distance * 4, 0.85)) * 9000 + (symbolSeed % 17) * 90));
    for (const optionType of ["call", "put"] as const) {
      const directional = optionType === "call" ? Math.max(0.08, 1 - distance * 5) : Math.max(0.08, 0.85 - distance * 4);
      const intrinsic =
        optionType === "call" ? Math.max(0, underlyingPrice - strike) : Math.max(0, strike - underlyingPrice);
      const extrinsic = Math.max(0.35, underlyingPrice * (0.012 + distance * 0.08));
      const mid = Number((intrinsic + extrinsic).toFixed(2));
      const spread = Math.max(0.02, mid * 0.035);
      const deltaMagnitude = Math.max(0.05, Math.min(0.95, 0.5 + (underlyingPrice - strike) / underlyingPrice * 4));
      contracts.push({
        symbol: optionTicker(symbol, expirationDate, optionType, strike),
        underlyingSymbol: symbol,
        expirationDate,
        strike,
        optionType,
        gamma: Number((0.0025 * directional + 0.0004).toFixed(5)),
        delta: Number((optionType === "call" ? deltaMagnitude : -(1 - deltaMagnitude)).toFixed(3)),
        theta: Number((-0.04 * directional - 0.01).toFixed(3)),
        vega: Number((0.09 * directional + 0.02).toFixed(3)),
        impliedVolatility: Number((0.18 + distance * 1.2 + (symbolSeed % 7) / 100).toFixed(3)),
        openInterest: Math.round(oiBase * (optionType === "call" ? 1.08 : 0.94)),
        dayVolume: Math.round(volumeBase * (optionType === "call" ? 1.05 : 0.98)),
        dayOpen: mid * 0.96,
        dayHigh: mid * 1.12,
        dayLow: mid * 0.9,
        dayClose: mid,
        bid: Number((mid - spread / 2).toFixed(2)),
        ask: Number((mid + spread / 2).toFixed(2)),
        bidSize: 10 + (symbolSeed % 8),
        askSize: 12 + (symbolSeed % 6),
        last: Number((mid + (optionType === "call" ? spread * 0.2 : -spread * 0.2)).toFixed(2)),
        lastSize: 1 + (symbolSeed % 5),
        breakEvenPrice: optionType === "call" ? strike + mid : strike - mid,
        multiplier: 100
      });
    }
  }
  return contracts;
}

export class MockProvider implements OptionsDataProvider {
  name = "mock";
  mode = "mock" as const;

  async get0DteOptionChain(symbol: string): Promise<OptionChainSnapshot> {
    return this.getOptionChainByExpiration({ symbol, expirationDate: getCurrentMarketDate() });
  }

  async getOptionChainByExpiration(params: { symbol: string; expirationDate: string }): Promise<OptionChainSnapshot> {
    const symbol = params.symbol.toUpperCase();
    const validation = validateMockSymbol(symbol);
    if (!validation.isOptionable) {
      return {
        provider: "mock",
        providerMode: "mock",
        dataRecency: "not_available",
        underlyingSymbol: symbol,
        underlyingPrice: mockUnderlyingPrices[symbol] ?? 0,
        expirationDate: params.expirationDate,
        fetchedAt: new Date().toISOString(),
        isPartial: false,
        pageCount: 0,
        apiCallsUsed: 0,
        warnings: [validation.reason ?? "No listed options contracts were found for this symbol."],
        contracts: []
      };
    }
    const underlyingPrice = getSessionAdjustedUnderlyingPrice(symbol, params.expirationDate);
    return {
      provider: "mock",
      providerMode: "mock",
      dataRecency: "mock",
      underlyingSymbol: symbol,
      underlyingPrice,
      expirationDate: params.expirationDate,
      fetchedAt: new Date().toISOString(),
      isPartial: false,
      pageCount: 1,
      apiCallsUsed: 0,
      warnings: [],
      contracts: buildContracts(symbol, params.expirationDate, underlyingPrice)
    };
  }

  async checkCapability() {
    return {
      provider: "mock",
      providerMode: "mock" as const,
      canSearchTickers: true,
      canFetchContracts: true,
      canFetchSnapshot: true,
      canCalculateRealGex: false,
      dataRecency: "mock" as const,
      message: "Mock mode uses deterministic generated options data for UI and analytics testing."
    };
  }
}

export const mockProvider = new MockProvider();
