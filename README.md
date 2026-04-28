# Multi-Symbol Options Analytics Dashboard

Personal-use options analytics dashboard for US stocks and ETFs. The MVP runs on deterministic mock data so the UI, analytics pipeline, symbol search, favorites, recent symbols, and watchlist can be validated before connecting Massive Snapshot access.

## Setup

Use yarn only:

```bash
yarn install
cp .env.example .env.local
yarn dev
```

Tests and checks:

```bash
yarn test
yarn typecheck
yarn lint
yarn build
```

Do not use npm and do not create `package-lock.json`.

## Provider Modes

`mock` supports the full dashboard using generated deterministic options data.

`massive-contracts` is for ticker search, contract discovery, optionable validation, expiration discovery, and strike discovery. It cannot calculate real GEX because it does not include snapshot Greeks, quotes, trades, open interest, and full chain fields.

`massive-snapshot-delayed` and `massive-snapshot-realtime` require Massive Option Chain Snapshot access for real GEX, DEX, Greeks, top contracts, OI, volume, and IV analytics.

## API Budget

The app is designed around 5 provider calls per minute. Browser code never calls Massive directly. Provider calls go through backend routes, token bucket budget checks, cache, stale cache, and fetch locks. Watchlist cards are cache-first and manually refreshed.

## Analytics

GEX formula:

```txt
Contract GEX 1% = gamma * openInterest * multiplier * underlyingPrice^2 * 0.01 * sign
Call sign = positive
Put sign = negative
```

DEX formula:

```txt
DEX = delta * openInterest * multiplier * underlyingPrice
```

Premium proxy:

```txt
premiumProxy = midPrice * volume * multiplier
```

This is not true buy/sell order flow. Flow Proxy is estimated and direction is unknown unless a bid/ask/last heuristic can label it likely buyer initiated or likely seller initiated.

Open interest is generally not a real-time intraday field. Minute-by-minute changes mostly reflect updated underlying price, quotes, trades, Greeks, and IV, not necessarily updated open interest.

Darkpool data, true sweeps, true dealer position inference, brokerage trading, and AI trade recommendations are not implemented in the MVP.

## Disclaimer

This dashboard is for research and visualization only. It is not financial advice and does not place trades.
