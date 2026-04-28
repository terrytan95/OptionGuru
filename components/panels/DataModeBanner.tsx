export function DataModeBanner({ mode }: { mode: string }) {
  return (
    <div className="warning">
      Data mode: {mode}. Estimated/proxy analytics are clearly labeled. No brokerage trading or financial advice is provided.
    </div>
  );
}
