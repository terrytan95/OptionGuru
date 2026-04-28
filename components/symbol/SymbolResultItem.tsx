"use client";

import type { SymbolSearchResult } from "@/lib/symbols/types";

export function SymbolResultItem({
  result,
  active,
  onSelect
}: {
  result: SymbolSearchResult;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button className={`search-item ${active ? "active" : ""}`} onMouseDown={onSelect}>
      <span>
        <strong>{result.symbol}</strong>
        <span className="muted"> · {result.name}</span>
      </span>
      <span className="muted">{result.isOptionable === false ? "No options" : result.market}</span>
    </button>
  );
}
