"use client";

import { useEffect, useState } from "react";
import { WatchlistGrid } from "@/components/watchlist/WatchlistGrid";
import { appConfig } from "@/lib/config";
import { getFavorites } from "@/lib/symbols/favorites";

export function WatchlistPage() {
  const [symbols, setSymbols] = useState<string[]>([]);
  useEffect(() => {
    const favorites = getFavorites();
    setSymbols(favorites.length ? favorites.map((favorite) => favorite.symbol) : appConfig.defaultFavorites);
  }, []);
  return (
    <>
      <div className="dashboard-header">
        <div>
          <h1>Watchlist</h1>
          <p className="muted">
            Watchlist cards use cached data by default. Refresh symbols manually to avoid exceeding the provider API limit.
          </p>
        </div>
      </div>
      <WatchlistGrid symbols={symbols} />
    </>
  );
}
