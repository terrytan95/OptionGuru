import { describe, expect, it } from "vitest";
import { validateMockSymbol } from "@/lib/provider/mock/mockSymbols";

describe("optionable", () => {
  it("detects non-optionable mock symbols", () => {
    expect(validateMockSymbol("NOOPT").isOptionable).toBe(false);
    expect(validateMockSymbol("AAPL").isOptionable).toBe(true);
  });
});
