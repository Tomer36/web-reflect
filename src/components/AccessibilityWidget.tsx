"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Accessibility, Check } from "lucide-react";

// Keep in sync with the small script in the layout that applies the saved
// choices before the first paint.
const STORAGE_KEY = "a11y-preferences";
const MAX_TEXT_SCALE = 2;

type Preferences = {
  textScale: number;
  highContrast: boolean;
  underlineLinks: boolean;
  stopAnimations: boolean;
};

const DEFAULT_PREFERENCES: Preferences = {
  textScale: 0,
  highContrast: false,
  underlineLinks: false,
  stopAnimations: false,
};

const TOGGLES = [
  { key: "highContrast", label: "contrast" },
  { key: "underlineLinks", label: "links" },
  { key: "stopAnimations", label: "motion" },
] as const;

type Labels = {
  open: string;
  title: string;
  textSize: string;
  smaller: string;
  bigger: string;
  contrast: string;
  links: string;
  motion: string;
  reset: string;
  statement: string;
};

function applyPreferences(prefs: Preferences) {
  const root = document.documentElement;
  root.classList.remove("a11y-text-scale-1", "a11y-text-scale-2");
  if (prefs.textScale > 0) {
    root.classList.add(`a11y-text-scale-${prefs.textScale}`);
  }
  root.classList.toggle("a11y-high-contrast", prefs.highContrast);
  root.classList.toggle("a11y-underline-links", prefs.underlineLinks);
  root.classList.toggle("a11y-stop-animations", prefs.stopAnimations);
}

export function AccessibilityWidget({ labels, statementHref }: { labels: Labels; statementHref: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFERENCES);
  const box = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement>(null);

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

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        opener.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [isOpen]);

  function update(next: Preferences) {
    setPrefs(next);
    applyPreferences(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }

  return (
    <div className="a11y" ref={box}>
      {isOpen && (
        <div className="a11y-panel card" id="a11y-panel" role="group" aria-label={labels.title}>
          <p className="a11y-title">{labels.title}</p>

          <div className="a11y-size">
            <span>{labels.textSize}</span>
            <button
              type="button"
              onClick={() => update({ ...prefs, textScale: Math.max(0, prefs.textScale - 1) })}
              disabled={prefs.textScale === 0}
              aria-label={labels.smaller}
            >
              A−
            </button>
            <button
              type="button"
              onClick={() => update({ ...prefs, textScale: Math.min(MAX_TEXT_SCALE, prefs.textScale + 1) })}
              disabled={prefs.textScale === MAX_TEXT_SCALE}
              aria-label={labels.bigger}
            >
              A+
            </button>
          </div>

          {TOGGLES.map((toggle) => (
            <button
              key={toggle.key}
              type="button"
              className="a11y-toggle"
              aria-pressed={prefs[toggle.key]}
              onClick={() => update({ ...prefs, [toggle.key]: !prefs[toggle.key] })}
            >
              <span>{labels[toggle.label]}</span>
              <Check className="icon" size={16} strokeWidth={1.5} aria-hidden="true" />
            </button>
          ))}

          <button type="button" className="a11y-reset" onClick={() => update(DEFAULT_PREFERENCES)}>
            {labels.reset}
          </button>
          <Link className="a11y-link" href={statementHref} onClick={() => setIsOpen(false)}>
            {labels.statement}
          </Link>
        </div>
      )}

      <button
        ref={opener}
        type="button"
        className="a11y-btn"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={labels.open}
        aria-expanded={isOpen}
        aria-controls="a11y-panel"
      >
        <Accessibility className="icon" size={24} strokeWidth={1.5} aria-hidden="true" />
      </button>
    </div>
  );
}
