import { describe, expect, it } from "vitest";

describe("recent symbols", () => {
  it("storage key is stable", async () => {
    const mod = await import("@/lib/symbols/recentSymbols");
    expect(mod.RECENT_SYMBOLS_STORAGE_KEY).toBe("options-dashboard:recent-symbols");
  });
});
