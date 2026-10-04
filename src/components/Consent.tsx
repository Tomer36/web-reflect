"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// Cookie consent + Google Analytics 4.
// The layout renders this ONLY when NEXT_PUBLIC_GA4_ID is set at build time.
// Without it the site sets no cookies, so there is nothing to ask consent for.
// With it, GA is loaded only after the visitor presses "accept"; the choice is
// kept in localStorage and can be changed from "cookie settings" in the footer.
const KEY = "wr-consent";

type Labels = { label: string; text: string; accept: string; decline: string; privacy: string };

export function Consent({ gaId, labels, privacyHref }: { gaId: string; labels: Labels; privacyHref: string }) {
  const [visible, setVisible] = useState(false);
  const loaded = useRef(false);
  const flags = () => window as unknown as Record<string, unknown>;

  function loadGa() {
    flags()[`ga-disable-${gaId}`] = false;
    if (loaded.current) return;
    loaded.current = true;
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);
    const w = window as unknown as { dataLayer: unknown[]; gtag: (...args: unknown[]) => void };
    w.dataLayer = w.dataLayer || [];
    w.gtag = function () {
      // gtag expects the arguments object itself
      // eslint-disable-next-line prefer-rest-params
      w.dataLayer.push(arguments);
    };
    w.gtag("js", new Date());
    w.gtag("config", gaId);
  }

  useEffect(() => {
    let choice: string | null = null;
    try {
      choice = localStorage.getItem(KEY);
    } catch {}
    if (choice === "granted") loadGa();
    // Client-only bootstrap from localStorage, as in AccessibilityWidget.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    else if (choice !== "denied") setVisible(true);

    const reopen = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("[data-consent-reset]")) setVisible(true);
    };
    document.addEventListener("click", reopen);
    return () => document.removeEventListener("click", reopen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function choose(choice: "granted" | "denied") {
    try {
      localStorage.setItem(KEY, choice);
    } catch {}
    setVisible(false);
    if (choice === "granted") loadGa();
    else flags()[`ga-disable-${gaId}`] = true;
  }

  if (!visible) return null;

  return (
    <div className="consent card" role="region" aria-label={labels.label}>
      <p>
        {labels.text} <Link href={privacyHref}>{labels.privacy}</Link>
      </p>
      <div className="btn-row">
        <button className="btn btn-primary btn-sm" type="button" onClick={() => choose("granted")}>
          {labels.accept}
        </button>
        <button className="btn btn-secondary btn-sm" type="button" onClick={() => choose("denied")}>
          {labels.decline}
        </button>
      </div>
    </div>
  );
}
