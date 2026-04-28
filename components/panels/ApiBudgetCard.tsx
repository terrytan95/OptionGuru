import { getProviderStatus } from "@/lib/services/providerStatusService";

export function ApiBudgetCard({ status }: { status: ReturnType<typeof getProviderStatus> }) {
  const nextRefillTime = status.nextRefillAt.slice(11, 19);

  return (
    <section className="panel metric">
      <span>API Budget</span>
      <strong>
        {status.callsRemainingThisMinute}/{status.callsPerMinuteLimit} left
      </strong>
      <span>Next refill {nextRefillTime} UTC</span>
    </section>
  );
}
