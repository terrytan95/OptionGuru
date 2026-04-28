import { getProviderStatus } from "@/lib/services/providerStatusService";

export function ProviderStatusCard({ status }: { status: ReturnType<typeof getProviderStatus> }) {
  return (
    <section className="panel metric">
      <span>Provider Status</span>
      <strong>{status.provider}</strong>
      <span>
        {status.mode} · {status.dataRecency} · cache {status.cacheStatus}
      </span>
    </section>
  );
}
