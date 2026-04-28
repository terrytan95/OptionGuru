import { describe, expect, it } from "vitest";
import { calculateContractGex, calculateGexByStrike } from "@/lib/analytics/gex";
import { contract } from "@/tests/helpers";

describe("gex", () => {
  it("uses positive call sign and negative put sign", () => {
    expect(calculateContractGex(contract({ optionType: "call" }), 100)).toBeGreaterThan(0);
    expect(calculateContractGex(contract({ optionType: "put" }), 100)).toBeLessThan(0);
  });

  it("skips missing gamma when grouped", () => {
    expect(calculateGexByStrike([contract({ gamma: null })], 100)).toHaveLength(0);
  });
});
