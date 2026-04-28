import { describe, expect, it } from "vitest";
import { calculateContractDex } from "@/lib/analytics/dex";
import { contract } from "@/tests/helpers";

describe("dex", () => {
  it("uses signed delta", () => {
    expect(calculateContractDex(contract({ delta: -0.4, optionType: "put" }), 100)).toBeLessThan(0);
  });
});
