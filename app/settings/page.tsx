import { AppShell } from "@/components/layout/AppShell";
import { AlertTriangle, Clock3, Database, Gauge, HardDrive, SlidersHorizontal, ToggleLeft } from "lucide-react";
import { appConfig } from "@/lib/config";
import { getProviderStatus } from "@/lib/services/providerStatusService";

function SettingCard({
  icon,
  title,
  description,
  children
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="panel settings-card">
      <div className="settings-card-header">
        <div className="settings-icon">{icon}</div>
        <div>
          <h3>{title}</h3>
          <p className="muted">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function SettingRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="settings-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default function SettingsPage() {
  const status = getProviderStatus();
  return (
    <AppShell>
      <div className="dashboard-header page-title">
        <div>
          <h1>Settings</h1>
          <p className="muted">Review provider mode, refresh timing, cache policy, budget controls, and MVP limits.</p>
        </div>
        <div className="status-pill">Mode {appConfig.providerMode}</div>
      </div>

      <div className="settings-grid">
        <SettingCard
          icon={<Database size={18} />}
          title="Data Provider"
          description="Controls where option-chain data comes from."
        >
          <SettingRow label="Current mode" value={appConfig.providerMode} />
          <SettingRow label="Provider" value={status.provider} />
          <SettingRow label="Data recency" value={status.dataRecency} />
          <SettingRow label="Default symbol" value={appConfig.defaultSymbol} />
        </SettingCard>

        <SettingCard
          icon={<Clock3 size={18} />}
          title="Refresh & Cache"
          description="Keeps active pages current without over-fetching."
        >
          <SettingRow label="Dashboard refresh" value={`${appConfig.frontendRefreshSeconds}s`} />
          <SettingRow label="Server refresh target" value={`${appConfig.serverRefreshSeconds}s`} />
          <SettingRow label="Fresh cache window" value={`${appConfig.cacheTtlSeconds}s`} />
          <SettingRow label="Stale fallback window" value={`${appConfig.staleCacheTtlSeconds}s`} />
        </SettingCard>

        <SettingCard icon={<Gauge size={18} />} title="API Budget" description="Protects provider calls under strict limits.">
          <SettingRow label="Call limit" value={`${status.callsPerMinuteLimit}/min`} />
          <SettingRow label="Remaining now" value={status.callsRemainingThisMinute} />
          <SettingRow label="Used this minute" value={status.callsUsedThisMinute} />
          <SettingRow label="Next refill" value={`${status.nextRefillAt.slice(11, 19)} UTC`} />
        </SettingCard>

        <SettingCard
          icon={<SlidersHorizontal size={18} />}
          title="Option Chain Scope"
          description="Default analytics window for loaded option chains."
        >
          <SettingRow label="Strike window" value={`${appConfig.defaultStrikeWindowPercent}%`} />
          <SettingRow label="Snapshot page limit" value={appConfig.massivePageLimit} />
          <SettingRow label="Max pages per refresh" value={appConfig.massiveMaxPagesPerRefresh} />
          <SettingRow label="Default favorites" value={appConfig.defaultFavorites.join(", ")} />
        </SettingCard>

        <SettingCard icon={<ToggleLeft size={18} />} title="Feature Flags" description="MVP modules currently enabled.">
          <SettingRow label="Flow Proxy" value={appConfig.enableFlowProxy ? "Enabled" : "Disabled"} />
          <SettingRow label="Scanner" value={appConfig.enableScanner ? "Enabled" : "Disabled"} />
          <SettingRow label="Historical storage" value="Disabled in MVP" />
          <SettingRow label="Darkpool provider" value="Not configured" />
        </SettingCard>

        <SettingCard
          icon={<HardDrive size={18} />}
          title="Local Storage"
          description="Personal preferences stored in this browser."
        >
          <SettingRow label="Favorites key" value="options-dashboard:favorites" />
          <SettingRow label="Recent symbols key" value="options-dashboard:recent-symbols" />
          <SettingRow label="Theme key" value="options-dashboard:theme" />
          <SettingRow label="Max recent symbols" value={appConfig.maxRecentSymbols} />
        </SettingCard>
      </div>

      <section className="panel settings-note">
        <div className="settings-card-header">
          <div className="settings-icon warning-icon">
            <AlertTriangle size={18} />
          </div>
          <div>
            <h3>Data Limitations</h3>
            <p className="muted">
              Flow Proxy and Premium Proxy are estimates. Open interest is usually end-of-prior-trading-day data. This
              dashboard is for research and visualization only.
            </p>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
