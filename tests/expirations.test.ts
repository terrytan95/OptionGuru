import { describe, expect, it } from "vitest";
import { calculateExpirationRows } from "@/lib/analytics/expirations";
import { contract } from "@/tests/helpers";

describe("expirations", () => {
  it("summarizes loaded expirations", () => {
    expect(calculateExpirationRows([contract()], 100)[0].totalVolume).toBe(50);
  });
});
