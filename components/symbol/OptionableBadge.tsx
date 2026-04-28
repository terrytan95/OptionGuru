export function OptionableBadge({ isOptionable }: { isOptionable: boolean }) {
  return (
    <span className="status-pill" style={{ color: isOptionable ? "var(--green)" : "var(--amber)" }}>
      {isOptionable ? "Optionable" : "No listed options"}
    </span>
  );
}
