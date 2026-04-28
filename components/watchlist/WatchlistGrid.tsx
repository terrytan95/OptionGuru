"use client";

import { WatchlistCard } from "@/components/watchlist/WatchlistCard";

export function WatchlistGrid({ symbols }: { symbols: string[] }) {
  if (!symbols.length) return <p className="muted">Add favorites from a symbol dashboard to build your watchlist.</p>;
  return (
    <div className="grid cols-3">
      {symbols.map((symbol) => (
        <WatchlistCard key={symbol} symbol={symbol} />
      ))}
    </div>
  );
}
