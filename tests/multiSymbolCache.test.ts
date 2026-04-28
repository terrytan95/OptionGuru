import { describe, expect, it } from "vitest";
import { memoryCache } from "@/lib/cache/memoryCache";

describe("multi symbol cache", () => {
  it("keeps symbol-specific keys separate", () => {
    memoryCache.set("snapshot:mock:SPY", "spy", 10);
    memoryCache.set("snapshot:mock:AAPL", "aapl", 10);
    expect(memoryCache.getFresh("snapshot:mock:SPY")).toBe("spy");
    expect(memoryCache.getFresh("snapshot:mock:AAPL")).toBe("aapl");
  });
});
