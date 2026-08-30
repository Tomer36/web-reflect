"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { SlidersHorizontal, X } from "lucide-react";

const STORAGE_KEY = "a11y-preferences";
const MAX_TEXT_SCALE = 2;

type Preferences = {
  textScale: number;
  highContrast: boolean;
  underlineLinks: boolean;
};

const DEFAULT_PREFERENCES: Preferences = {
  textScale: 0,
  highContrast: false,
  underlineLinks: false,
};

function applyPreferences(prefs: Preferences) {
  const root = document.documentElement;
  root.classList.remove("a11y-text-scale-1", "a11y-text-scale-2");
  if (prefs.textScale > 0) {
    root.classList.add(`a11y-text-scale-${prefs.textScale}`);
  }
  root.classList.toggle("a11y-high-contrast", prefs.highContrast);
  root.classList.toggle("a11y-underline-links", prefs.underlineLinks);
}

export function AccessibilityWidget() {
  const t = useTranslations("accessibility");
  const [isOpen, setIsOpen] = useState(false);
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
        // One-time client-only bootstrap from localStorage (not derived
        // state) — SSR/the static export has no access to it, so this
        // can't be computed during render.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPrefs(parsed);
        applyPreferences(parsed);
      }
    } catch {}
  }, []);

  function update(next: Preferences) {
    setPrefs(next);
    applyPreferences(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={t("openWidget")}
        aria-expanded={isOpen}
        className="fixed bottom-5 end-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white shadow-lg transition-transform hover:opacity-90 active:scale-90"
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <SlidersHorizontal className="h-5 w-5" />
        )}
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label={t("panelTitle")}
          className="fixed bottom-20 end-5 z-40 flex w-72 max-w-[calc(100vw-2.5rem)] flex-col gap-4 rounded-2xl border border-border bg-surface p-5 shadow-2xl"
        >
          <h2 className="text-sm font-semibold text-foreground">
            {t("panelTitle")}
          </h2>

          <div className="flex flex-col gap-2">
            <span className="text-xs text-muted">{t("textSize")}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  update({
                    ...prefs,
                    textScale: Math.max(0, prefs.textScale - 1),
                  })
                }
                disabled={prefs.textScale === 0}
                aria-label={t("decreaseText")}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-sm font-semibold text-foreground disabled:opacity-30"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => update({ ...prefs, textScale: 0 })}
                className="flex h-9 items-center justify-center rounded-full border border-border px-3 text-xs text-foreground"
              >
                {t("reset")}
              </button>
              <button
                type="button"
                onClick={() =>
                  update({
                    ...prefs,
                    textScale: Math.min(MAX_TEXT_SCALE, prefs.textScale + 1),
                  })
                }
                disabled={prefs.textScale === MAX_TEXT_SCALE}
                aria-label={t("increaseText")}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-base font-semibold text-foreground disabled:opacity-30"
              >
                A+
              </button>
            </div>
          </div>

          <label className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted">{t("highContrast")}</span>
            <input
              type="checkbox"
              checked={prefs.highContrast}
              onChange={(e) =>
                update({ ...prefs, highContrast: e.target.checked })
              }
              className="relative h-5 w-9 cursor-pointer appearance-none rounded-full bg-border-strong transition-colors checked:bg-accent before:absolute before:start-0.5 before:top-0.5 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition-transform checked:before:translate-x-4 rtl:checked:before:-translate-x-4"
            />
          </label>

          <label className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted">{t("underlineLinks")}</span>
            <input
              type="checkbox"
              checked={prefs.underlineLinks}
              onChange={(e) =>
                update({ ...prefs, underlineLinks: e.target.checked })
              }
              className="relative h-5 w-9 cursor-pointer appearance-none rounded-full bg-border-strong transition-colors checked:bg-accent before:absolute before:start-0.5 before:top-0.5 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition-transform checked:before:translate-x-4 rtl:checked:before:-translate-x-4"
            />
          </label>
        </div>
      )}
    </>
  );
}
