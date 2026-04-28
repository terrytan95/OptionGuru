import { describe, expect, it } from "vitest";
import { runScanner } from "@/lib/analytics/scanner";
import { contract } from "@/tests/helpers";

describe("scanner", () => {
  it("flags high volume over oi", () => {
    expect(runScanner([contract({ dayVolume: 300, openInterest: 100 })], 520).some((signal) => signal.type === "HIGH_VOLUME_OI")).toBe(true);
  });
});
