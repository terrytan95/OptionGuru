"use client";

import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { formatCurrencyCompact, formatDataAge, formatPrice } from "@/lib/format";

interface CardData {
  snapshot: { underlyingSymbol: string; underlyingPrice: number; fetchedAt: string };
  levels: { callWall: number | null; putWall: number | null };
  gexRows: { netGex: number }[];
  validation: { isOptionable: boolean; reason?: string };
}

export function WatchlistCard({ symbol, refreshSeconds }: { symbol: string; refreshSeconds: number }) {
  const [data, setData] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const response = await fetch(`/api/options/summary?symbol=${symbol}`);
    setData((await response.json()) as CardData);
    setLoading(false);
  }, [symbol]);

  useEffect(() => {
    void load();
    const interval = window.setInterval(() => {
      void load();
    }, Math.max(1, refreshSeconds) * 1000);
    return () => window.clearInterval(interval);
  }, [load, refreshSeconds]);

  const netGex = data?.gexRows.reduce((sum, row) => sum + row.netGex, 0) ?? 0;

  return (
    <section className="panel watchlist-card">
      <div className="watchlist-card-header">
        <Link href={`/dashboard/${symbol}`}>
          <h3>{symbol}</h3>
        </Link>
        <div className="watchlist-actions">
          <span className="status-pill">{loading ? "Refreshing" : "Cached"}</span>
          <button className="icon-button" onClick={load} disabled={loading} title="Manual refresh">
            <RefreshCw size={15} />
          </button>
        </div>
      </div>
      {data ? (
        <div className="watchlist-card-body">
          <div className="metric">
            <span>Underlying</span>
            <strong>{formatPrice(data.snapshot.underlyingPrice)}</strong>
          </div>
          <div className="watchlist-card-stats">
            <span>Net GEX</span>
            <strong>{formatCurrencyCompact(netGex)}</strong>
          </div>
          <div className="watchlist-card-levels">
            <span>Call Wall {data.levels.callWall ?? "n/a"}</span>
            <span>Put Wall {data.levels.putWall ?? "n/a"}</span>
          </div>
          <div className="muted">Data age {formatDataAge(data.snapshot.fetchedAt)} · refreshes every {refreshSeconds}s</div>
          {!data.validation.isOptionable ? <div className="warning">{data.validation.reason}</div> : null}
        </div>
      ) : (
        <div className="watchlist-loading">
          <span className="skeleton-line" />
          <span className="skeleton-line short" />
          <p className="muted">Loading cached symbol data...</p>
        </div>
      )}
    </section>
  );
}
