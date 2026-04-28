"use client";

import { useState } from "react";
import { WatchlistCard } from "@/components/watchlist/WatchlistCard";

export function WatchlistGrid({
  symbols,
  refreshSeconds,
  onReorder
}: {
  symbols: string[];
  refreshSeconds: number;
  onReorder: (symbols: string[]) => void;
}) {
  const [draggedSymbol, setDraggedSymbol] = useState<string | null>(null);
  const [dragOverSymbol, setDragOverSymbol] = useState<string | null>(null);

  function moveSymbol(targetSymbol: string) {
    if (!draggedSymbol || draggedSymbol === targetSymbol) return;
    const next = [...symbols];
    const fromIndex = next.indexOf(draggedSymbol);
    const toIndex = next.indexOf(targetSymbol);
    if (fromIndex < 0 || toIndex < 0) return;
    next.splice(fromIndex, 1);
    next.splice(toIndex, 0, draggedSymbol);
    onReorder(next);
  }

  if (!symbols.length) return <p className="muted">Add favorites from a symbol dashboard to build your watchlist.</p>;
  return (
    <div className="grid cols-3 watchlist-grid">
      {symbols.map((symbol) => (
        <div
          key={symbol}
          className={`watchlist-drag-item ${draggedSymbol === symbol ? "dragging" : ""} ${dragOverSymbol === symbol ? "drag-over" : ""}`}
          draggable
          onDragStart={(event) => {
            setDraggedSymbol(symbol);
            event.dataTransfer.effectAllowed = "move";
            event.dataTransfer.setData("text/plain", symbol);
          }}
          onDragEnter={() => setDragOverSymbol(symbol)}
          onDragOver={(event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = "move";
          }}
          onDragLeave={() => setDragOverSymbol((current) => (current === symbol ? null : current))}
          onDrop={(event) => {
            event.preventDefault();
            moveSymbol(symbol);
            setDragOverSymbol(null);
            setDraggedSymbol(null);
          }}
          onDragEnd={() => {
            setDragOverSymbol(null);
            setDraggedSymbol(null);
          }}
        >
          <WatchlistCard symbol={symbol} refreshSeconds={refreshSeconds} />
        </div>
      ))}
    </div>
  );
}
