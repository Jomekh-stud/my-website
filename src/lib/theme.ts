export type Theme = "light" | "dark";
export type ThemePreference = Theme | "auto";

export const THEME_STORAGE_KEY = "theme";
const THEME_CACHE_KEY = "theme-auto-cache";

type ThemeCache = {
  day: string;
  sunrise: string;
  sunset: string;
};

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

function parseThemeCache(rawCache: string | null): ThemeCache | null {
  if (!rawCache) return null;

  try {
    const parsed = JSON.parse(rawCache) as ThemeCache;
    if (!parsed.day || !parsed.sunrise || !parsed.sunset) return null;
    return parsed;
  } catch {
    return null;
  }
}

function getThemeFromTimes(sunriseIso: string, sunsetIso: string) {
  const now = new Date();
  const sunrise = new Date(sunriseIso);
  const sunset = new Date(sunsetIso);

  const lightStart = new Date(sunrise.getTime() + 60 * 60 * 1000);
  const lightEnd = new Date(sunset.getTime() - 60 * 60 * 1000);

  return now >= lightStart && now < lightEnd ? "light" : "dark";
}

function getCachedAutoTheme() {
  const cache = parseThemeCache(window.localStorage.getItem(THEME_CACHE_KEY));
  if (!cache) return null;

  const today = new Date().toISOString().slice(0, 10);
  if (cache.day !== today) return null;

  return getThemeFromTimes(cache.sunrise, cache.sunset);
}

function getCurrentPosition() {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Geolocation unavailable"));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 4000,
      maximumAge: 30 * 60 * 1000,
    });
  });
}

async function getAutoThemeFromSunTimes(): Promise<Theme> {
  const cachedTheme = getCachedAutoTheme();
  if (cachedTheme) return cachedTheme;

  const position = await getCurrentPosition();
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const response = await fetch(
    `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&formatted=0`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error("Sunrise API request failed");
  }

  const data = (await response.json()) as {
    results?: { sunrise?: string; sunset?: string };
    status?: string;
  };

  if (data.status !== "OK" || !data.results?.sunrise || !data.results?.sunset) {
    throw new Error("Sunrise API payload invalid");
  }

  const today = new Date().toISOString().slice(0, 10);
  window.localStorage.setItem(
    THEME_CACHE_KEY,
    JSON.stringify({
      day: today,
      sunrise: data.results.sunrise,
      sunset: data.results.sunset,
    }),
  );

  return getThemeFromTimes(data.results.sunrise, data.results.sunset);
}

export async function getPreferredTheme(): Promise<Theme> {
  const storedTheme = getStoredThemePreference();
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  try {
    return await getAutoThemeFromSunTimes();
  } catch {
    return fallbackThemeForCurrentHour();
  }
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