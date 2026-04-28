import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Options Analytics Dashboard",
  description: "Multi-symbol options analytics dashboard with mock and provider-aware data modes."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const themeScript = `
    (function () {
      try {
        var key = "options-dashboard:theme";
        var theme = window.localStorage.getItem(key);
        var allowed = ["dark", "light", "terminal", "graphite"];
        if (allowed.indexOf(theme) === -1) theme = "dark";
        document.documentElement.dataset.theme = theme;
      } catch (_) {}
    })();
  `;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
