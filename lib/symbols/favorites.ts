import { appConfig } from "@/lib/config";
import { readJson, writeJson } from "@/lib/storage/browserStorage";
import type { FavoriteSymbol } from "@/lib/symbols/types";

export const FAVORITES_STORAGE_KEY = "options-dashboard:favorites";

export function getFavorites(): FavoriteSymbol[] {
  return readJson<FavoriteSymbol[]>(FAVORITES_STORAGE_KEY, []);
}

export function saveFavorites(favorites: FavoriteSymbol[]): void {
  writeJson(FAVORITES_STORAGE_KEY, favorites.slice(0, appConfig.maxFavorites));
}

export function toggleFavorite(symbol: string, name: string | null): FavoriteSymbol[] {
  const normalized = symbol.toUpperCase();
  const favorites = getFavorites();
  const exists = favorites.some((favorite) => favorite.symbol === normalized);
  const next = exists
    ? favorites.filter((favorite) => favorite.symbol !== normalized)
    : [{ symbol: normalized, name, addedAt: new Date().toISOString(), lastOpenedAt: null }, ...favorites];
  saveFavorites(next);
  return next;
}
