export function WarningsPanel({ warnings }: { warnings: string[] }) {
  if (!warnings.length) return null;
  return (
    <section className="panel">
      <h3>Data Warnings</h3>
      <div className="grid">
        {warnings.map((warning) => (
          <div className="warning" key={warning}>
            {warning}
          </div>
        ))}
      </div>
    </section>
  );
}
