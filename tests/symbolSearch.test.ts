import { describe, expect, it } from "vitest";
import { searchMockSymbols } from "@/lib/provider/mock/mockSymbols";
import { normalizeTicker } from "@/lib/symbols/normalizeTicker";

describe("symbol search", () => {
  it("normalizes and returns exact match first", () => {
    expect(normalizeTicker(" app$l ")).toBe("APPL");
    expect(searchMockSymbols("AAPL")[0].symbol).toBe("AAPL");
  });
});
