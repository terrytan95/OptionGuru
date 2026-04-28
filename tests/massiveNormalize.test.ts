import { describe, expect, it } from "vitest";
import { normalizeMassiveOptionItem } from "@/lib/provider/massive/normalizers";

describe("massive normalizer", () => {
  it("handles missing quote trade and greeks", () => {
    const normalized = normalizeMassiveOptionItem(
      { details: { ticker: "O:A", expiration_date: "2026-04-27", strike_price: 100, contract_type: "call" } },
      "AAPL"
    );
    expect(normalized?.gamma).toBeNull();
    expect(normalized?.openInterest).toBe(0);
  });
});
