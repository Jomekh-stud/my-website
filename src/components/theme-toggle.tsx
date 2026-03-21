"use client";

import { Check, ChevronDown, Laptop, Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  applyThemePreference,
  getStoredThemePreference,
  type Theme,
  type ThemePreference,
} from "@/lib/theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [preference, setPreference] = useState<ThemePreference>("auto");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;

    async function syncTheme() {
      const currentPreference = getStoredThemePreference();
      const currentTheme = await applyThemePreference(currentPreference);
      if (!active) return;

      setPreference(currentPreference);
      setTheme(currentTheme);
    }

    void syncTheme();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!containerRef.current) return;
      if (containerRef.current.contains(event.target as Node)) return;
      setOpen(false);
    }

    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onEscape);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onEscape);
    };
  }, []);

  async function updateThemePreference(nextPreference: ThemePreference) {
    const nextTheme = await applyThemePreference(nextPreference);
    setPreference(nextPreference);
    setTheme(nextTheme);
    setOpen(false);
  }

  const modeIcon = preference === "auto"
    ? Laptop
    : preference === "dark"
      ? Moon
      : Sun;
  const ModeIcon = modeIcon;

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-10 items-center gap-1 rounded-full border border-foreground/10 bg-surface px-3 text-foreground/80 shadow-sm shadow-black/5 transition-colors hover:border-primary/20 hover:text-primary"
        aria-label="Theme selector"
        aria-expanded={open}
        aria-haspopup="menu"
        title={`Theme: ${preference === "auto" ? `Auto (${theme})` : preference}`}
      >
        <ModeIcon size={15} />
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-2 min-w-40 rounded-xl border border-foreground/10 bg-surface p-1 shadow-lg shadow-black/15"
          role="menu"
          aria-label="Choose theme mode"
        >
          {[
            {
              value: "auto",
              label: `Auto (${theme === "dark" ? "Dark now" : "Light now"})`,
              icon: Laptop,
            },
            { value: "light", label: "Light", icon: Sun },
            { value: "dark", label: "Dark", icon: Moon },
          ].map(({ value, label, icon: Icon }) => {
            const active = preference === value;

            return (
              <button
                key={value}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => void updateThemePreference(value as ThemePreference)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-primary/14 text-primary"
                    : "text-foreground/75 hover:bg-foreground/6 hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon size={14} />
                  {label}
                </span>
                {active && <Check size={14} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}