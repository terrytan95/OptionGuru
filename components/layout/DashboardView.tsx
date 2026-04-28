"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GexByStrikeChart } from "@/components/charts/GexByStrikeChart";
import { GreekExposureChart } from "@/components/charts/GreekExposureChart";
import { IntradayActivityChart } from "@/components/charts/IntradayActivityChart";
import { OiByStrikeChart } from "@/components/charts/OiByStrikeChart";
import { DashboardTabs } from "@/components/layout/DashboardTabs";
import { ApiBudgetCard } from "@/components/panels/ApiBudgetCard";
import { DataModeBanner } from "@/components/panels/DataModeBanner";
import { DealerLevelsPanel } from "@/components/panels/DealerLevelsPanel";
import { ExpirationTable } from "@/components/panels/ExpirationTable";
import { OptionsSummaryCards } from "@/components/panels/OptionsSummaryCards";
import { OverviewCards } from "@/components/panels/OverviewCards";
import { ProviderStatusCard } from "@/components/panels/ProviderStatusCard";
import { ScannerPanel } from "@/components/panels/ScannerPanel";
import { TopContractsTable } from "@/components/panels/TopContractsTable";
import { WarningsPanel } from "@/components/panels/WarningsPanel";
import { FavoriteButton } from "@/components/symbol/FavoriteButton";
import { OptionableBadge } from "@/components/symbol/OptionableBadge";
import { addRecentSymbol } from "@/lib/symbols/recentSymbols";
import { formatDataAge, formatPrice } from "@/lib/format";
import { getProviderStatus } from "@/lib/services/providerStatusService";
import type { DashboardPayload } from "@/lib/services/optionsDashboardService";

export function DashboardView({
  payload,
  providerStatus,
  refreshSeconds
}: {
  payload: DashboardPayload;
  providerStatus: ReturnType<typeof getProviderStatus>;
  refreshSeconds: number;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Overview");
  const symbol = payload.snapshot.underlyingSymbol;
  const optionable = payload.validation.isOptionable;

  useEffect(() => {
    addRecentSymbol(symbol, null);
  }, [symbol]);

  useEffect(() => {
    const intervalMs = Math.max(1, refreshSeconds) * 1000;
    const interval = window.setInterval(() => {
      router.refresh();
    }, intervalMs);
    return () => window.clearInterval(interval);
  }, [refreshSeconds, router]);

  return (
    <>
      <div className="dashboard-header">
        <div>
          <div className="symbol-title">
            <h1>{symbol}</h1>
            <FavoriteButton symbol={symbol} name={null} />
            <OptionableBadge isOptionable={optionable} />
          </div>
          <div className="status-strip" style={{ marginTop: 12 }}>
            <span className="status-pill">Expiration {payload.snapshot.expirationDate}</span>
            <span className="status-pill" suppressHydrationWarning>
              Updated {formatDataAge(payload.snapshot.fetchedAt)} ago
            </span>
            <span className="status-pill">Snapshot {payload.snapshot.dataRecency}</span>
            <span className="status-pill">API {providerStatus.callsRemainingThisMinute}/{providerStatus.callsPerMinuteLimit} left</span>
            <span className="status-pill">Auto refresh {refreshSeconds}s</span>
          </div>
        </div>
        <div className="price">{formatPrice(payload.snapshot.underlyingPrice)}</div>
      </div>

      <DataModeBanner mode={payload.snapshot.providerMode} />
      <DashboardTabs active={activeTab} onChange={setActiveTab} disabled={!optionable} />

      {!optionable ? (
        <div className="disabled-state">
          <h2>No listed options contracts were found for this symbol.</h2>
          <p>
            This dashboard requires listed options data. You can still add this symbol to favorites, but GEX, DEX, open
            interest, volume heatmaps, top contracts, and Greeks are unavailable.
          </p>
        </div>
      ) : null}

      {optionable && activeTab === "Overview" ? (
        <div className="grid tab-panel">
          <OverviewCards payload={payload} />
          <div className="grid cols-3">
            <ProviderStatusCard status={providerStatus} />
            <ApiBudgetCard status={providerStatus} />
            <OptionsSummaryCards summary={payload.summary} />
          </div>
          <DealerLevelsPanel levels={payload.levels} />
          <WarningsPanel warnings={payload.warnings} />
        </div>
      ) : null}

      {optionable && activeTab === "Flow Proxy" ? (
        <div className="grid tab-panel">
          <div className="warning">This is an estimated flow proxy. It is not true exchange-classified buy/sell flow.</div>
          <IntradayActivityChart rows={payload.flowRows} />
          <TopContractsTable rows={payload.topContracts} />
        </div>
      ) : null}

      {optionable && activeTab === "GEX" ? (
        <div className="grid cols-2 tab-panel">
          <GexByStrikeChart rows={payload.gexRows} />
          <DealerLevelsPanel levels={payload.levels} />
        </div>
      ) : null}

      {optionable && activeTab === "OI & Volume" ? (
        <div className="tab-panel">
          <OiByStrikeChart rows={payload.gexRows} />
        </div>
      ) : null}
      {optionable && activeTab === "Top Contracts" ? (
        <div className="tab-panel">
          <TopContractsTable rows={payload.topContracts} />
        </div>
      ) : null}
      {optionable && activeTab === "Expirations" ? (
        <div className="tab-panel">
          <ExpirationTable rows={payload.expirationRows} />
        </div>
      ) : null}
      {optionable && activeTab === "Greeks" ? (
        <div className="tab-panel">
          <GreekExposureChart rows={payload.greekRows} />
        </div>
      ) : null}
      {optionable && activeTab === "Scanner" ? (
        <div className="tab-panel">
          <ScannerPanel rows={payload.scannerSignals} />
        </div>
      ) : null}
      {activeTab === "Settings" ? (
        <section className="panel tab-panel">
          <h3>Settings</h3>
          <p className="muted">
            Provider mode, refresh interval, cache behavior, and stale data warnings are configured through environment
            variables. Favorites and recent symbols use browser localStorage for this MVP.
          </p>
        </section>
      ) : null}
    </>
  );
}
