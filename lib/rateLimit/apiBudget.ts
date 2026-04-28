import { appConfig } from "@/lib/config";
import { TokenBucket } from "@/lib/rateLimit/tokenBucket";

export type ApiBudgetPriority =
  | "active-symbol"
  | "manual-refresh"
  | "symbol-validation"
  | "watchlist"
  | "background";

const bucket = new TokenBucket(appConfig.maxCallsPerMinute, appConfig.maxCallsPerMinute, 60_000);

export const apiBudget = {
  acquire(_priority: ApiBudgetPriority = "background", cost = 1): boolean {
    return bucket.tryAcquire(cost);
  },
  snapshot() {
    const snapshot = bucket.getSnapshot();
    return {
      callsPerMinuteLimit: snapshot.capacity,
      callsUsedThisMinute: snapshot.used,
      callsRemainingThisMinute: snapshot.remaining,
      nextRefillAt: snapshot.nextRefillAt
    };
  }
};
