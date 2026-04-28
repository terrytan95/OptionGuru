import { describe, expect, it } from "vitest";
import { getNextLikelyTradingDate } from "@/lib/marketDate";

describe("market date", () => {
  it("moves Saturday to Monday", () => {
    expect(getNextLikelyTradingDate(new Date("2026-04-25T12:00:00Z"))).toBe("2026-04-27");
  });

  it("moves after the New York close to the next trading day", () => {
    expect(getNextLikelyTradingDate(new Date("2026-04-27T21:00:00Z"))).toBe("2026-04-28");
  });
});
