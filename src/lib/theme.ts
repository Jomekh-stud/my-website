export type Theme = "light" | "dark";
export type ThemePreference = Theme | "auto";

export const THEME_STORAGE_KEY = "theme";

function fallbackThemeForCurrentHour() {
  const hour = new Date().getHours();
  return hour >= 7 && hour < 19 ? "light" : "dark";
}

export function getStoredThemePreference(): ThemePreference {
  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme === "light" || storedTheme === "dark" || storedTheme === "auto") {
    return storedTheme;
  }

  return "auto";
}

export async function getPreferredTheme(): Promise<Theme> {
  const storedTheme = getStoredThemePreference();
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return fallbackThemeForCurrentHour();
}

export async function applyThemePreference(preference: ThemePreference): Promise<Theme> {
  const resolvedTheme = preference === "auto"
    ? await getPreferredTheme()
    : preference;

  document.documentElement.dataset.theme = resolvedTheme;
  document.documentElement.dataset.themePreference = preference;
  window.localStorage.setItem(THEME_STORAGE_KEY, preference);

  return resolvedTheme;
}