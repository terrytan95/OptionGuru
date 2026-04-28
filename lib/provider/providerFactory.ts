import { appConfig } from "@/lib/config";
import { mockProvider } from "@/lib/provider/mock/mockProvider";
import type { OptionsDataProvider } from "@/lib/provider/types";

export function getOptionsProvider(): OptionsDataProvider {
  if (appConfig.providerMode !== "mock") {
    return {
      name: "massive",
      mode: appConfig.providerMode,
      get0DteOptionChain: (symbol) => mockProvider.get0DteOptionChain(symbol),
      getOptionChainByExpiration: (params) => mockProvider.getOptionChainByExpiration(params),
      async checkCapability() {
        return {
          provider: "massive",
          providerMode: appConfig.providerMode,
          canSearchTickers: true,
          canFetchContracts: true,
          canFetchSnapshot: appConfig.providerMode.startsWith("massive-snapshot"),
          canCalculateRealGex: appConfig.providerMode.startsWith("massive-snapshot"),
          dataRecency: appConfig.providerMode === "massive-snapshot-realtime" ? "realtime" : "delayed_15m",
          message:
            appConfig.providerMode === "massive-contracts"
              ? "Contract metadata is available, but real options analytics require Option Chain Snapshot access."
              : "Massive snapshot mode is configured. This MVP keeps browser calls server-side and uses the shared analytics pipeline."
        };
      }
    };
  }
  return mockProvider;
}
