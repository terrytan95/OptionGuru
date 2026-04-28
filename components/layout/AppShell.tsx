import { TopBar } from "@/components/layout/TopBar";

export function AppShell({ activeSymbol, children }: { activeSymbol?: string; children: React.ReactNode }) {
  return (
    <main className="shell">
      <TopBar activeSymbol={activeSymbol} />
      <div className="container page-transition">{children}</div>
    </main>
  );
}
