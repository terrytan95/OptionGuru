import { appConfig } from "@/lib/config";
import { memoryCache } from "@/lib/cache/memoryCache";
import { withFetchLock } from "@/lib/cache/fetchLock";
import { calculateExpirationRows } from "@/lib/analytics/expirations";
import { calculateFlowProxyByStrike } from "@/lib/analytics/flowProxy";
import { calculateGexByStrike } from "@/lib/analytics/gex";
import { calculateGreekExposureByStrike } from "@/lib/analytics/greekExposure";
import { buildHeatmap, type HeatmapType } from "@/lib/analytics/heatmaps";
import { calculateDealerLevels } from "@/lib/analytics/levels";
import { calculateOptionsSummary } from "@/lib/analytics/optionsSummary";
import { runScanner } from "@/lib/analytics/scanner";
import { getTopContracts, type TopContractRankBy } from "@/lib/analytics/topContracts";
import { getOptionsProvider } from "@/lib/provider/providerFactory";
import type { OptionChainSnapshot } from "@/lib/provider/types";
import { normalizeTicker } from "@/lib/symbols/normalizeTicker";
import { validateOptionableSymbol } from "@/lib/services/optionableService";
import { getCurrentMarketDate } from "@/lib/marketDate";

export interface DashboardPayload {
  snapshot: OptionChainSnapshot;
  validation: Awaited<ReturnType<typeof validateOptionableSymbol>>;
  summary: ReturnType<typeof calculateOptionsSummary>;
  gexRows: ReturnType<typeof calculateGexByStrike>;
  greekRows: ReturnType<typeof calculateGreekExposureByStrike>;
  levels: ReturnType<typeof calculateDealerLevels>;
  topContracts: ReturnType<typeof getTopContracts>;
  flowRows: ReturnType<typeof calculateFlowProxyByStrike>;
  expirationRows: ReturnType<typeof calculateExpirationRows>;
  scannerSignals: ReturnType<typeof runScanner>;
  warnings: string[];
  cacheStatus: "fresh" | "stale" | "miss";
}

async function getSnapshot(symbol: string): Promise<{ snapshot: OptionChainSnapshot; cacheStatus: "fresh" | "stale" | "miss" }> {
  const normalized = normalizeTicker(symbol);
  const marketDate = getCurrentMarketDate();
  const cacheKey = `snapshot:${appConfig.providerMode}:${normalized}:${marketDate}:0dte:${appConfig.defaultStrikeWindowPercent}`;
  const fresh = memoryCache.getFresh<OptionChainSnapshot>(cacheKey);
  if (fresh) return { snapshot: fresh, cacheStatus: "fresh" };
  const stale = memoryCache.getStale<OptionChainSnapshot>(cacheKey);
  if (stale) return { snapshot: { ...stale, warnings: [...stale.warnings, "STALE_CACHE: Stale cached snapshot returned."] }, cacheStatus: "stale" };
  const snapshot = await withFetchLock(cacheKey, () => getOptionsProvider().get0DteOptionChain(normalized));
  memoryCache.set(cacheKey, snapshot, appConfig.cacheTtlSeconds, appConfig.staleCacheTtlSeconds);
  return { snapshot, cacheStatus: "miss" };
}

export async function getDashboardPayload(symbol: string, rankBy: TopContractRankBy = "premium"): Promise<DashboardPayload> {
  const validation = await validateOptionableSymbol(symbol);
  const { snapshot, cacheStatus } = await getSnapshot(validation.symbol);
  const contracts = snapshot.contracts;
  const summary = calculateOptionsSummary(contracts, snapshot.underlyingPrice || 1);
  const gexRows = calculateGexByStrike(contracts, snapshot.underlyingPrice || 1);
  const greekRows = calculateGreekExposureByStrike(contracts, snapshot.underlyingPrice || 1);
  const levels = calculateDealerLevels(gexRows, contracts, snapshot.underlyingPrice || 1);
  const topContracts = getTopContracts(contracts, snapshot.underlyingPrice || 1, rankBy);
  const flowRows = calculateFlowProxyByStrike(contracts);
  const expirationRows = calculateExpirationRows(contracts, snapshot.underlyingPrice || 1);
  const scannerSignals = runScanner(contracts, snapshot.underlyingPrice || 1);
  return {
    snapshot,
    validation,
    summary,
    gexRows,
    greekRows,
    levels,
    topContracts,
    flowRows,
    expirationRows,
    scannerSignals,
    warnings: [...snapshot.warnings, cacheStatus === "stale" ? "STALE_CACHE: This response used stale cached data." : ""].filter(Boolean),
    cacheStatus
  };
}

export async function getHeatmapPayload(symbol: string, type: HeatmapType) {
  const payload = await getDashboardPayload(symbol);
  return {
    symbol: payload.snapshot.underlyingSymbol,
    type,
    rows: buildHeatmap(payload.snapshot.contracts, payload.snapshot.underlyingPrice, type),
    warnings: payload.warnings
  };
}
