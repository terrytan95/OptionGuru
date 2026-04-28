"use client";

import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { getFavorites, toggleFavorite } from "@/lib/symbols/favorites";

export function FavoriteButton({ symbol, name }: { symbol: string; name: string | null }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(getFavorites().some((favorite) => favorite.symbol === symbol));
  }, [symbol]);

  return (
    <button
      className="icon-button"
      onClick={() => {
        const next = toggleFavorite(symbol, name);
        setActive(next.some((favorite) => favorite.symbol === symbol));
        window.dispatchEvent(new Event("favorites-changed"));
      }}
      title={active ? "Remove favorite" : "Add favorite"}
    >
      <Star size={16} fill={active ? "var(--amber)" : "none"} color={active ? "var(--amber)" : "currentColor"} />
    </button>
  );
}
