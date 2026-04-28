export type AssetClass =
  | "stocks"
  | "etfs"
  | "indices"
  | "crypto"
  | "forex"
  | "unknown";

export interface SymbolSearchResult {
  symbol: string;
  name: string | null;
  market: string | null;
  locale: string | null;
  primaryExchange: string | null;
  type: string | null;
  active: boolean;
  currency: string | null;
  isOptionable: boolean | null;
  optionableCheckedAt: string | null;
}

export interface SymbolValidationResult {
  symbol: string;
  exists: boolean;
  active: boolean | null;
  isUsEquityLike: boolean;
  isOptionable: boolean;
  reason?: string;
}

export interface FavoriteSymbol {
  symbol: string;
  name: string | null;
  addedAt: string;
  lastOpenedAt: string | null;
  notes?: string;
}

export interface RecentSymbol {
  symbol: string;
  name: string | null;
  openedAt: string;
}
