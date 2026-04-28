import type { SymbolSearchResult, SymbolValidationResult } from "@/lib/symbols/types";

type MockSymbolSeed = [string, string, string];

const mockSymbolSeeds: MockSymbolSeed[] = [
  ["SPY", "SPDR S&P 500 ETF Trust", "etfs"],
  ["QQQ", "Invesco QQQ Trust", "etfs"],
  ["IWM", "iShares Russell 2000 ETF", "etfs"],
  ["AAPL", "Apple Inc.", "stocks"],
  ["MSFT", "Microsoft Corporation", "stocks"],
  ["NVDA", "NVIDIA Corporation", "stocks"],
  ["TSLA", "Tesla, Inc.", "stocks"],
  ["AMD", "Advanced Micro Devices, Inc.", "stocks"],
  ["META", "Meta Platforms, Inc.", "stocks"],
  ["AMZN", "Amazon.com, Inc.", "stocks"],
  ["GOOGL", "Alphabet Inc.", "stocks"],
  ["NFLX", "Netflix, Inc.", "stocks"],
  ["NOOPT", "No Options Example Corp.", "stocks"],
  ["TEST", "Test Non Optionable Asset", "stocks"]
];

export function getMockSymbolCatalog(now = new Date()): SymbolSearchResult[] {
  const checkedAt = now.toISOString();
  return mockSymbolSeeds.map(([symbol, name, market]) => ({
    symbol,
    name,
    market,
    locale: "us",
    primaryExchange: market === "etfs" ? "ARCX" : "XNAS",
    type: market === "etfs" ? "ETF" : "CS",
    active: true,
    currency: "usd",
    isOptionable: !["NOOPT", "TEST"].includes(symbol),
    optionableCheckedAt: checkedAt
  }));
}

export const mockUnderlyingPrices: Record<string, number> = {
  SPY: 520,
  QQQ: 440,
  IWM: 205,
  AAPL: 189.4,
  MSFT: 425,
  NVDA: 890,
  TSLA: 172,
  AMD: 155,
  META: 505,
  AMZN: 183,
  GOOGL: 168,
  NFLX: 615
};

export function searchMockSymbols(query: string): SymbolSearchResult[] {
  const normalized = query.trim().toUpperCase();
  return getMockSymbolCatalog()
    .filter((item) => item.symbol.includes(normalized) || item.name?.toUpperCase().includes(normalized))
    .sort((a, b) => Number(b.symbol === normalized) - Number(a.symbol === normalized) || a.symbol.localeCompare(b.symbol))
    .slice(0, 20);
}

export function validateMockSymbol(symbol: string): SymbolValidationResult {
  const normalized = symbol.trim().toUpperCase();
  const match = getMockSymbolCatalog().find((item) => item.symbol === normalized);
  if (!match) {
    return {
      symbol: normalized,
      exists: false,
      active: null,
      isUsEquityLike: false,
      isOptionable: false,
      reason: "Symbol was not found in the configured provider."
    };
  }
  if (!match.isOptionable) {
    return {
      symbol: normalized,
      exists: true,
      active: true,
      isUsEquityLike: true,
      isOptionable: false,
      reason: "No listed options contracts were found for this symbol."
    };
  }
  return { symbol: normalized, exists: true, active: true, isUsEquityLike: true, isOptionable: true };
}
