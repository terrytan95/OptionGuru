import { describe, expect, it } from "vitest";
import { calculateOptionsSummary } from "@/lib/analytics/optionsSummary";
import { contract } from "@/tests/helpers";

describe("options summary", () => {
  it("calculates volume, oi, iv, and signed premium proxy", () => {
    const summary = calculateOptionsSummary([contract(), contract({ optionType: "put" })], 100);
    expect(summary.totalCallVolume).toBe(50);
    expect(summary.totalPutVolume).toBe(50);
    expect(summary.netPremiumProxy).toBe(0);
    expect(summary.averageIv).toBe(0.2);
  });
});
