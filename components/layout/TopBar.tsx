import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { FavoritesBar } from "@/components/symbol/FavoritesBar";
import { SymbolSearch } from "@/components/symbol/SymbolSearch";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export function TopBar({ activeSymbol }: { activeSymbol?: string }) {
  return (
    <header className="topbar">
      <div className="container topbar-inner">
        <SymbolSearch />
        <FavoritesBar activeSymbol={activeSymbol} />
        <nav className="brand">
          <BarChart3 size={18} />
          <Link href="/watchlist">Watchlist</Link>
          <Link href="/settings">Settings</Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
