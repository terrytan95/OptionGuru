import { describe, expect, it } from "vitest";
import { getTopContracts } from "@/lib/analytics/topContracts";
import { contract } from "@/tests/helpers";

describe("top contracts", () => {
  it("ranks by volume and premium", () => {
    expect(getTopContracts([contract({ symbol: "A", dayVolume: 1 }), contract({ symbol: "B", dayVolume: 10 })], 100, "volume")[0].contractSymbol).toBe("B");
    expect(getTopContracts([contract({ symbol: "A", bid: 1, ask: 1 }), contract({ symbol: "B", bid: 5, ask: 5 })], 100, "premium")[0].contractSymbol).toBe("B");
  });
});
