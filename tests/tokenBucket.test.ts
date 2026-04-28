import { describe, expect, it } from "vitest";
import { TokenBucket } from "@/lib/rateLimit/tokenBucket";

describe("token bucket", () => {
  it("enforces capacity", () => {
    const bucket = new TokenBucket(5, 5, 60_000);
    expect([1, 2, 3, 4, 5].every(() => bucket.tryAcquire())).toBe(true);
    expect(bucket.tryAcquire()).toBe(false);
  });
});
