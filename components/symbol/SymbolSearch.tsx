"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getRecentSymbols } from "@/lib/symbols/recentSymbols";
import type { RecentSymbol, SymbolSearchResult } from "@/lib/symbols/types";
import { SymbolResultItem } from "@/components/symbol/SymbolResultItem";

export function SymbolSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SymbolSearchResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState<RecentSymbol[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const handle = window.setTimeout(async () => {
      const response = await fetch(`/api/symbols/search?q=${encodeURIComponent(query)}`);
      const data = (await response.json()) as { results: SymbolSearchResult[] };
      setResults(data.results);
      setActiveIndex(0);
      setOpen(true);
    }, 300);
    return () => window.clearTimeout(handle);
  }, [query]);

  async function selectSymbol(symbol: string) {
    await fetch(`/api/symbols/validate?symbol=${encodeURIComponent(symbol)}`);
    setOpen(false);
    setQuery("");
    router.push(`/dashboard/${symbol.toUpperCase()}`);
  }

  const visibleRecent = !query.trim() && recent.length > 0;

  return (
    <div className="search">
      <input
        suppressHydrationWarning
        value={query}
        onFocus={() => {
          setRecent(getRecentSymbols());
          setOpen(true);
        }}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
          if (event.key === "ArrowDown") setActiveIndex((index) => Math.min(index + 1, results.length - 1));
          if (event.key === "ArrowUp") setActiveIndex((index) => Math.max(index - 1, 0));
          if (event.key === "Enter" && results[activeIndex]) void selectSymbol(results[activeIndex].symbol);
        }}
        placeholder="Search symbols: SPY, AAPL, NVDA..."
        aria-label="Search symbols"
        autoComplete="off"
        spellCheck={false}
      />
      <Search size={16} style={{ position: "absolute", right: 12, top: 13, color: "var(--muted)" }} />
      {open && (results.length > 0 || visibleRecent) ? (
        <div className="search-menu">
          {visibleRecent
            ? recent.map((item) => (
                <button key={item.symbol} className="search-item" onMouseDown={() => selectSymbol(item.symbol)}>
                  <strong>{item.symbol}</strong>
                  <span className="muted">Recent</span>
                </button>
              ))
            : results.map((result, index) => (
                <SymbolResultItem
                  key={result.symbol}
                  result={result}
                  active={index === activeIndex}
                  onSelect={() => selectSymbol(result.symbol)}
                />
              ))}
        </div>
      ) : null}
    </div>
  );
}
