"use client";

import { useEffect, useState } from "react";
import { WatchlistGrid } from "@/components/watchlist/WatchlistGrid";
import { appConfig } from "@/lib/config";
import { getFavorites, reorderFavoritesBySymbol } from "@/lib/symbols/favorites";

export function WatchlistPage() {
  const [symbols, setSymbols] = useState<string[]>([]);
  useEffect(() => {
    const favorites = getFavorites();
    setSymbols(favorites.length ? favorites.map((favorite) => favorite.symbol) : appConfig.defaultFavorites);
  }, []);

  function handleReorder(nextSymbols: string[]) {
    setSymbols(nextSymbols);
    reorderFavoritesBySymbol(nextSymbols);
    window.dispatchEvent(new Event("favorites-changed"));
  }

  return (
    <>
      <div className="dashboard-header page-title">
        <div>
          <h1>Watchlist</h1>
          <p className="muted">
            Drag cards to reorder your watchlist. The order is saved with favorites and cards refresh every 15 seconds.
          </p>
        </div>
        <div className="status-pill">{symbols.length} symbols</div>
      </div>
      <WatchlistGrid symbols={symbols} refreshSeconds={appConfig.frontendRefreshSeconds} onReorder={handleReorder} />
    </>
  );
}
