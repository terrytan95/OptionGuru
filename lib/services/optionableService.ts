import { appConfig } from "@/lib/config";
import { memoryCache } from "@/lib/cache/memoryCache";
import { validateMockSymbol } from "@/lib/provider/mock/mockSymbols";
import { normalizeTicker } from "@/lib/symbols/normalizeTicker";
import type { SymbolValidationResult } from "@/lib/symbols/types";

export async function validateOptionableSymbol(symbol: string): Promise<SymbolValidationResult> {
  const normalized = normalizeTicker(symbol);
  const key = `optionable:${normalized}`;
  const cached = memoryCache.getFresh<SymbolValidationResult>(key);
  if (cached) return cached;
  const result = validateMockSymbol(normalized);
  memoryCache.set(key, result, appConfig.optionableCacheTtlSeconds, appConfig.optionableCacheTtlSeconds);
  return result;
}
