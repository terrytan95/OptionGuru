import { appConfig } from "@/lib/config";
import { readJson, writeJson } from "@/lib/storage/browserStorage";
import type { RecentSymbol } from "@/lib/symbols/types";

export const RECENT_SYMBOLS_STORAGE_KEY = "options-dashboard:recent-symbols";

export function getRecentSymbols(): RecentSymbol[] {
  return readJson<RecentSymbol[]>(RECENT_SYMBOLS_STORAGE_KEY, []);
}

export function addRecentSymbol(symbol: string, name: string | null): RecentSymbol[] {
  const normalized = symbol.toUpperCase();
  const next = [
    { symbol: normalized, name, openedAt: new Date().toISOString() },
    ...getRecentSymbols().filter((recent) => recent.symbol !== normalized)
  ].slice(0, appConfig.maxRecentSymbols);
  writeJson(RECENT_SYMBOLS_STORAGE_KEY, next);
  return next;
}
