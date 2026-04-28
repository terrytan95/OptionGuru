import { AppShell } from "@/components/layout/AppShell";
import { appConfig } from "@/lib/config";
import { getProviderStatus } from "@/lib/services/providerStatusService";

export default function SettingsPage() {
  const status = getProviderStatus();
  return (
    <AppShell>
      <div className="dashboard-header">
        <div>
          <h1>Settings</h1>
          <p className="muted">Provider, refresh, cache, and feature-flag configuration.</p>
        </div>
      </div>
      <section className="panel">
        <table className="table">
          <tbody>
            <tr>
              <td>Provider mode</td>
              <td>{appConfig.providerMode}</td>
            </tr>
            <tr>
              <td>Server refresh</td>
              <td>{appConfig.serverRefreshSeconds}s</td>
            </tr>
            <tr>
              <td>Frontend polling</td>
              <td>{appConfig.frontendRefreshSeconds}s</td>
            </tr>
            <tr>
              <td>Cache TTL</td>
              <td>{appConfig.cacheTtlSeconds}s fresh / {appConfig.staleCacheTtlSeconds}s stale</td>
            </tr>
            <tr>
              <td>API budget</td>
              <td>{status.callsPerMinuteLimit} calls/minute</td>
            </tr>
          </tbody>
        </table>
      </section>
    </AppShell>
  );
}
