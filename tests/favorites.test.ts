import { describe, expect, it } from "vitest";

describe("favorites", () => {
  it("storage key is stable", async () => {
    const mod = await import("@/lib/symbols/favorites");
    expect(mod.FAVORITES_STORAGE_KEY).toBe("options-dashboard:favorites");
  });
});
