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
    <section className="panel">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <Link href={`/dashboard/${symbol}`}>
          <h3>{symbol}</h3>
        </Link>
        <button className="icon-button" onClick={load} disabled={loading} title="Manual refresh">
          <RefreshCw size={15} />
        </button>
      </div>
      {data ? (
        <div className="grid">
          <div className="metric">
            <span>Underlying</span>
            <strong>{formatPrice(data.snapshot.underlyingPrice)}</strong>
          </div>
          <div className="muted">Data age {formatDataAge(data.snapshot.fetchedAt)} · refreshes every {refreshSeconds}s</div>
          <div className="muted">Net GEX {formatCurrencyCompact(netGex)}</div>
          <div className="muted">Call wall {data.levels.callWall ?? "n/a"} · Put wall {data.levels.putWall ?? "n/a"}</div>
          {!data.validation.isOptionable ? <div className="warning">{data.validation.reason}</div> : null}
        </div>
      ) : (
        <p className="muted">Loading cached symbol data...</p>
      )}
    </section>
  );
}
