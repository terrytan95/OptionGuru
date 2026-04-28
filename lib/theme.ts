export const THEME_STORAGE_KEY = "options-dashboard:theme";

export const themes = [
  { id: "dark", label: "Dark" },
  { id: "light", label: "Light" },
  { id: "terminal", label: "Terminal" },
  { id: "graphite", label: "Graphite" }
] as const;

export type ThemeId = (typeof themes)[number]["id"];

export function isThemeId(value: string | null): value is ThemeId {
  return themes.some((theme) => theme.id === value);
}
