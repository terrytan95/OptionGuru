import { describe, expect, it } from "vitest";
import { sortSymbolsByRecency } from "@/lib/symbols/recentSymbols";

describe("recent symbols", () => {
  it("storage key is stable", async () => {
    const mod = await import("@/lib/symbols/recentSymbols");
    expect(mod.RECENT_SYMBOLS_STORAGE_KEY).toBe("options-dashboard:recent-symbols");
  });

  it("sorts symbol search results by most recent symbols first", () => {
    const sorted = sortSymbolsByRecency(
      [{ symbol: "AAPL" }, { symbol: "SPY" }, { symbol: "NVDA" }],
      [
        { symbol: "NVDA", name: null, openedAt: "2026-04-28T01:00:00.000Z" },
        { symbol: "SPY", name: null, openedAt: "2026-04-28T00:00:00.000Z" }
      ]
    );
    expect(sorted.map((item) => item.symbol)).toEqual(["NVDA", "SPY", "AAPL"]);
  });
});
