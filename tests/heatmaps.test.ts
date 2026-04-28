import { describe, expect, it } from "vitest";
import { buildHeatmap } from "@/lib/analytics/heatmaps";
import { contract } from "@/tests/helpers";

describe("heatmaps", () => {
  it("groups by strike and expiration", () => {
    expect(buildHeatmap([contract(), contract()], 100, "volume")[0].value).toBe(100);
  });
});
