import { appConfig } from "@/lib/config";
import { memoryCache } from "@/lib/cache/memoryCache";
import { searchMockSymbols } from "@/lib/provider/mock/mockSymbols";
import { normalizeTicker } from "@/lib/symbols/normalizeTicker";

export async function searchSymbols(query: string) {
  const normalized = normalizeTicker(query);
  if (!normalized) return { query: normalized, results: [], warnings: [] };
  const key = `tickerSearch:${normalized}`;
  const cached = memoryCache.getFresh<ReturnType<typeof searchMockSymbols>>(key);
  if (cached) return { query: normalized, results: cached, warnings: [] };
  const results = searchMockSymbols(normalized);
  memoryCache.set(key, results, appConfig.tickerSearchCacheTtlSeconds, appConfig.tickerSearchCacheTtlSeconds);
  return { query: normalized, results, warnings: [] };
}
