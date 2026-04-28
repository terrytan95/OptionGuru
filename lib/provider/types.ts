export type ProviderMode =
  | "mock"
  | "massive-contracts"
  | "massive-snapshot-delayed"
  | "massive-snapshot-realtime";

export type DataRecency =
  | "mock"
  | "delayed_15m"
  | "realtime"
  | "unknown"
  | "not_available";

export type OptionType = "call" | "put";

export interface NormalizedOptionContract {
  symbol: string;
  underlyingSymbol: string;
  expirationDate: string;
  strike: number;
  optionType: OptionType;
  gamma: number | null;
  delta: number | null;
  theta: number | null;
  vega: number | null;
  impliedVolatility: number | null;
  openInterest: number;
  dayVolume: number;
  dayOpen?: number | null;
  dayHigh?: number | null;
  dayLow?: number | null;
  dayClose?: number | null;
  bid: number | null;
  ask: number | null;
  bidSize: number | null;
  askSize: number | null;
  last: number | null;
  lastSize: number | null;
  breakEvenPrice?: number | null;
  multiplier: number;
}

export interface OptionChainSnapshot {
  provider: "massive" | "mock";
  providerMode: ProviderMode;
  dataRecency: DataRecency;
  underlyingSymbol: string;
  underlyingPrice: number;
  expirationDate: string;
  fetchedAt: string;
  isPartial: boolean;
  pageCount: number;
  apiCallsUsed: number;
  warnings: string[];
  contracts: NormalizedOptionContract[];
}

export interface ProviderCapabilityResult {
  provider: string;
  providerMode: ProviderMode;
  canSearchTickers: boolean;
  canFetchContracts: boolean;
  canFetchSnapshot: boolean;
  canCalculateRealGex: boolean;
  dataRecency: DataRecency;
  message: string;
}

export interface OptionsDataProvider {
  name: string;
  mode: ProviderMode;
  get0DteOptionChain(symbol: string): Promise<OptionChainSnapshot>;
  getOptionChainByExpiration(params: {
    symbol: string;
    expirationDate: string;
    strikeWindowPercent?: number;
  }): Promise<OptionChainSnapshot>;
  checkCapability?(symbol: string): Promise<ProviderCapabilityResult>;
}
