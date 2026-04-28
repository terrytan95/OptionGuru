"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { appConfig } from "@/lib/config";
import { getFavorites } from "@/lib/symbols/favorites";
import type { FavoriteSymbol } from "@/lib/symbols/types";

export function FavoritesBar({ activeSymbol }: { activeSymbol?: string }) {
  const [favorites, setFavorites] = useState<FavoriteSymbol[]>([]);

  useEffect(() => {
    const load = () => setFavorites(getFavorites());
    load();
    window.addEventListener("favorites-changed", load);
    return () => window.removeEventListener("favorites-changed", load);
  }, []);

  const symbols = favorites.length ? favorites : appConfig.defaultFavorites.map((symbol) => ({ symbol, name: null, addedAt: "", lastOpenedAt: null }));

  return (
    <div className="favorites">
      {symbols.map((favorite) => (
        <Link
          className="favorite-chip"
          style={favorite.symbol === activeSymbol ? { borderColor: "var(--blue)", color: "var(--blue)" } : undefined}
          href={`/dashboard/${favorite.symbol}`}
          key={favorite.symbol}
        >
          {favorite.symbol}
        </Link>
      ))}
    </div>
  );
}
