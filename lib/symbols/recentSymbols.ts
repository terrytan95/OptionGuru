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

export function sortSymbolsByRecency<T extends { symbol: string }>(items: T[], recentSymbols: RecentSymbol[]): T[] {
  const rank = new Map(recentSymbols.map((item, index) => [item.symbol, index]));
  return [...items].sort((a, b) => {
    const aRank = rank.get(a.symbol) ?? Number.POSITIVE_INFINITY;
    const bRank = rank.get(b.symbol) ?? Number.POSITIVE_INFINITY;
    if (aRank !== bRank) return aRank - bRank;
    return a.symbol.localeCompare(b.symbol);
  });
}
