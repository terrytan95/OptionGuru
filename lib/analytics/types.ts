export interface GexStrikeRow {
  strike: number;
  callGex: number;
  putGex: number;
  netGex: number;
  callOpenInterest: number;
  putOpenInterest: number;
  callVolume: number;
  putVolume: number;
}

export interface GreekExposureRow {
  strike: number;
  dex: number;
  gex: number;
  vex: number;
  tex: number;
}

export interface DealerLevels {
  callWall: number | null;
  putWall: number | null;
  maxPositiveGammaStrike: number | null;
  maxNegativeGammaStrike: number | null;
  zeroGammaApprox: number | null;
  highVolumeStrike: number | null;
  highOiStrike: number | null;
  atmStrike: number | null;
  expectedMoveProxy: number | null;
}

export interface OptionsSummary {
  totalCallVolume: number;
  totalPutVolume: number;
  callPutVolumeRatio: number | null;
  totalCallOpenInterest: number;
  totalPutOpenInterest: number;
  callPutOpenInterestRatio: number | null;
  callPremiumProxy: number;
  putPremiumProxy: number;
  netPremiumProxy: number;
  averageIv: number | null;
  atmIv: number | null;
  highestVolumeStrike: number | null;
  highestOiStrike: number | null;
}

export interface TopContractRow {
  contractSymbol: string;
  underlyingSymbol: string;
  optionType: "call" | "put";
  expirationDate: string;
  strike: number;
  bid: number | null;
  ask: number | null;
  last: number | null;
  mid: number;
  volume: number;
  openInterest: number;
  volumeOiRatio: number;
  impliedVolatility: number | null;
  delta: number | null;
  gamma: number | null;
  premiumProxy: number;
  gex: number;
  dex: number;
  spreadPercent: number | null;
}

export interface ScannerSignal {
  type:
    | "HIGH_VOLUME_OI"
    | "HIGH_PREMIUM"
    | "HIGH_GEX"
    | "HIGH_IV"
    | "TIGHT_SPREAD"
    | "NEAR_ATM"
    | "LARGE_PUT_CONCENTRATION"
    | "LARGE_CALL_CONCENTRATION";
  severity: "low" | "medium" | "high";
  symbol: string;
  contractSymbol?: string;
  message: string;
  value?: number;
}
