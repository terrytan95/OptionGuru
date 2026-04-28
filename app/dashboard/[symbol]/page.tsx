import { AppShell } from "@/components/layout/AppShell";
import { DashboardView } from "@/components/layout/DashboardView";
import { appConfig } from "@/lib/config";
import { getDashboardPayload } from "@/lib/services/optionsDashboardService";
import { getProviderStatus } from "@/lib/services/providerStatusService";
import { normalizeTicker } from "@/lib/symbols/normalizeTicker";

export default async function SymbolDashboardPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  const normalized = normalizeTicker(symbol || "SPY");
  const payload = await getDashboardPayload(normalized);
  const providerStatus = getProviderStatus(payload.cacheStatus);
  return (
    <AppShell activeSymbol={normalized}>
      <DashboardView payload={payload} providerStatus={providerStatus} refreshSeconds={appConfig.frontendRefreshSeconds} />
    </AppShell>
  );
}
