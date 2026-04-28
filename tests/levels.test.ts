import { describe, expect, it } from "vitest";
import { calculateDealerLevels } from "@/lib/analytics/levels";
import { contract } from "@/tests/helpers";

describe("levels", () => {
  it("interpolates zero gamma", () => {
    const levels = calculateDealerLevels(
      [
        { strike: 100, callGex: 0, putGex: -10, netGex: -10, callOpenInterest: 1, putOpenInterest: 1, callVolume: 1, putVolume: 1 },
        { strike: 110, callGex: 10, putGex: 0, netGex: 10, callOpenInterest: 1, putOpenInterest: 1, callVolume: 1, putVolume: 1 }
      ],
      [contract({ strike: 100 }), contract({ strike: 100, optionType: "put" })],
      105
    );
    expect(levels.zeroGammaApprox).toBe(105);
  });
});
