import { appConfig } from "@/lib/config";
import { apiBudget } from "@/lib/rateLimit/apiBudget";

export function getProviderStatus(cacheStatus: "fresh" | "stale" | "miss" = "fresh") {
  return {
    provider: appConfig.providerMode === "mock" ? "mock" : "massive",
    mode: appConfig.providerMode,
    dataRecency:
      appConfig.providerMode === "mock"
        ? "mock"
        : appConfig.providerMode === "massive-snapshot-realtime"
          ? "realtime"
          : "delayed_15m",
    ...apiBudget.snapshot(),
    lastSuccessfulFetchAt: new Date().toISOString(),
    cacheStatus,
    usingStaleCache: cacheStatus === "stale"
  };
}
