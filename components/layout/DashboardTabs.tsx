"use client";

const tabs = ["Overview", "Flow Proxy", "GEX", "OI & Volume", "Top Contracts", "Expirations", "Greeks", "Scanner", "Settings"];

export function DashboardTabs({
  active,
  onChange,
  disabled
}: {
  active: string;
  onChange: (tab: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="tabs">
      {tabs.map((tab) => {
        const tabDisabled = disabled && !["Overview", "Settings"].includes(tab);
        return (
          <button
            key={tab}
            className={`tab ${active === tab ? "active" : ""}`}
            disabled={tabDisabled}
            style={tabDisabled ? { opacity: 0.45, cursor: "not-allowed" } : undefined}
            onClick={() => !tabDisabled && onChange(tab)}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
