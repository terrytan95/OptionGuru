import type { NormalizedOptionContract } from "@/lib/provider/types";

type MassiveOptionItem = {
  details?: {
    ticker?: string;
    underlying_ticker?: string;
    expiration_date?: string;
    strike_price?: number;
    contract_type?: string;
    shares_per_contract?: number;
  };
  greeks?: { gamma?: number; delta?: number; theta?: number; vega?: number };
  implied_volatility?: number;
  open_interest?: number;
  day?: { volume?: number; open?: number; high?: number; low?: number; close?: number };
  last_quote?: { bid?: number; ask?: number; bid_price?: number; ask_price?: number; bid_size?: number; ask_size?: number };
  last_trade?: { price?: number; size?: number };
  break_even_price?: number;
};

export function normalizeMassiveOptionItem(item: MassiveOptionItem, symbol: string): NormalizedOptionContract | null {
  const details = item.details;
  if (!details?.ticker || !details.expiration_date || typeof details.strike_price !== "number") return null;
  if (details.contract_type !== "call" && details.contract_type !== "put") return null;
  return {
    symbol: details.ticker,
    underlyingSymbol: details.underlying_ticker ?? symbol,
    expirationDate: details.expiration_date,
    strike: details.strike_price,
    optionType: details.contract_type,
    gamma: item.greeks?.gamma ?? null,
    delta: item.greeks?.delta ?? null,
    theta: item.greeks?.theta ?? null,
    vega: item.greeks?.vega ?? null,
    impliedVolatility: item.implied_volatility ?? null,
    openInterest: item.open_interest ?? 0,
    dayVolume: item.day?.volume ?? 0,
    dayOpen: item.day?.open ?? null,
    dayHigh: item.day?.high ?? null,
    dayLow: item.day?.low ?? null,
    dayClose: item.day?.close ?? null,
    bid: item.last_quote?.bid ?? item.last_quote?.bid_price ?? null,
    ask: item.last_quote?.ask ?? item.last_quote?.ask_price ?? null,
    bidSize: item.last_quote?.bid_size ?? null,
    askSize: item.last_quote?.ask_size ?? null,
    last: item.last_trade?.price ?? null,
    lastSize: item.last_trade?.size ?? null,
    breakEvenPrice: item.break_even_price ?? null,
    multiplier: details.shares_per_contract ?? 100
  };
}
