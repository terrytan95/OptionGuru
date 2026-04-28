import type { ProviderMode } from "@/lib/provider/types";

function numberFromEnv(name: string, fallback: number): number {
  const value = process.env[name];
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function booleanFromEnv(name: string, fallback: boolean): boolean {
  const value = process.env[name];
  if (!value) return fallback;
  return value.toLowerCase() === "true";
}

export const appConfig = {
  providerMode: (process.env.GEX_DATA_PROVIDER ?? "mock") as ProviderMode,
  defaultSymbol: process.env.DEFAULT_SYMBOL ?? "SPY",
  defaultFavorites: (process.env.DEFAULT_FAVORITES ?? "SPY,QQQ,AAPL,NVDA,TSLA")
    .split(",")
    .map((symbol) => symbol.trim().toUpperCase())
    .filter(Boolean),
  maxCallsPerMinute: numberFromEnv("MASSIVE_MAX_CALLS_PER_MINUTE", 5),
  serverRefreshSeconds: numberFromEnv("SERVER_REFRESH_SECONDS", 15),
  frontendRefreshSeconds: numberFromEnv("NEXT_PUBLIC_FRONTEND_REFRESH_SECONDS", 15),
  cacheTtlSeconds: numberFromEnv("CACHE_TTL_SECONDS", 15),
  staleCacheTtlSeconds: numberFromEnv("STALE_CACHE_TTL_SECONDS", 300),
  tickerSearchCacheTtlSeconds: numberFromEnv("TICKER_SEARCH_CACHE_TTL_SECONDS", 86400),
  optionableCacheTtlSeconds: numberFromEnv("OPTIONABLE_CACHE_TTL_SECONDS", 86400),
  massivePageLimit: numberFromEnv("MASSIVE_PAGE_LIMIT", 250),
  massiveMaxPagesPerRefresh: numberFromEnv("MASSIVE_MAX_PAGES_PER_REFRESH", 4),
  defaultStrikeWindowPercent: numberFromEnv("DEFAULT_STRIKE_WINDOW_PERCENT", 8),
  maxFavorites: numberFromEnv("MAX_FAVORITES", 50),
  maxRecentSymbols: numberFromEnv("MAX_RECENT_SYMBOLS", 20),
  enableFlowProxy: booleanFromEnv("ENABLE_FLOW_PROXY", true),
  enableScanner: booleanFromEnv("ENABLE_SCANNER", true)
};
