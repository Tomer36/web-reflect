"use client";

import { useLocale } from "next-intl";
import { routing } from "@/i18n/routing";

const LABELS: Record<string, string> = {
  he: "עב",
  ar: "عر",
  en: "EN",
};

const LOCALE_PATHS: Record<string, string> = {
  he: "/he",
  ar: "/ar",
  en: "/en",
};

export function LocaleSwitcher({ className = "" }: { className?: string }) {
  const locale = useLocale();

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full border border-border bg-surface p-1 font-mono-ui text-xs ${className}`}
    >
      {routing.locales.map((loc) => (
        <a
          key={loc}
          href={LOCALE_PATHS[loc]}
          aria-current={loc === locale ? "page" : undefined}
          className={`rounded-full px-2.5 py-1 transition-colors ${
            loc === locale
              ? "bg-accent text-white"
              : "text-muted hover:text-foreground"
          }`}
        >
          {LABELS[loc]}
        </a>
      ))}
    </div>
  );
}
