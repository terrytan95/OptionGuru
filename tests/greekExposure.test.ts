import { describe, expect, it } from "vitest";
import { calculateGreekExposureByStrike } from "@/lib/analytics/greekExposure";
import { contract } from "@/tests/helpers";

describe("greek exposure", () => {
  it("groups gex dex vex tex by strike", () => {
    const rows = calculateGreekExposureByStrike([contract()], 100);
    expect(rows[0].vex).toBe(1000);
    expect(rows[0].tex).toBe(-200);
  });
});
