"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getRecentSymbols } from "@/lib/symbols/recentSymbols";
import type { RecentSymbol } from "@/lib/symbols/types";

export function RecentSymbols() {
  const [recent, setRecent] = useState<RecentSymbol[]>([]);
  useEffect(() => setRecent(getRecentSymbols()), []);
  if (!recent.length) return <p className="muted">No recent symbols yet.</p>;
  return (
    <div className="favorites">
      {recent.map((item) => (
        <Link className="recent-item" href={`/dashboard/${item.symbol}`} key={item.symbol}>
          {item.symbol}
        </Link>
      ))}
    </div>
  );
}
