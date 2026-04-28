"use client";

import { MonitorCog, Palette } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { isThemeId, THEME_STORAGE_KEY, themes, type ThemeId } from "@/lib/theme";

function applyTheme(theme: ThemeId): void {
  document.documentElement.dataset.theme = theme;
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeId>("dark");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    const nextTheme = isThemeId(stored) ? stored : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
  }, []);

  const activeLabel = useMemo(() => themes.find((item) => item.id === theme)?.label ?? "Theme", [theme]);

  return (
    <div className="theme-menu">
      <button
        className="icon-button theme-toggle"
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        title={`Theme: ${activeLabel}`}
        onClick={() => setOpen((value) => !value)}
      >
        <Palette size={16} />
        <span>{activeLabel}</span>
      </button>
      {open ? (
        <div className="theme-options" role="menu">
          {themes.map((item) => (
            <button
              key={item.id}
              className={`theme-option ${item.id === theme ? "active" : ""}`}
              type="button"
              role="menuitemradio"
              aria-checked={item.id === theme}
              onClick={() => {
                setTheme(item.id);
                applyTheme(item.id);
                setOpen(false);
              }}
            >
              <span className={`theme-swatch theme-swatch-${item.id}`} />
              <span>{item.label}</span>
              {item.id === theme ? <MonitorCog size={14} /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
