import { useTranslations } from "next-intl";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export function Hero() {
  const t = useTranslations("hero");
  const highlights = t.raw("highlights") as string[];

  return (
    <section
      id="top"
      className="bg-grid relative overflow-hidden border-b border-border"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute start-1/2 top-[-10rem] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-accent/25 blur-[120px] rtl:translate-x-1/2"
      />

      <div className="relative mx-auto grid max-w-6xl gap-8 px-5 py-16 sm:gap-12 sm:px-8 sm:py-24 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:py-32">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 font-mono-ui text-xs uppercase tracking-widest text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-signal" />
            {t("eyebrow")}
          </div>

          <h1 className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            {t("name")}
          </h1>

          <p className="text-balance mt-6 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
            {t("tagline")}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              {t("ctaPrimary")}
              <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" />
            </a>
            <a
              href="#portfolio"
              className="inline-flex items-center gap-2 rounded-full border border-border-strong px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface"
            >
              {t("ctaSecondary")}
              <ArrowDownRight className="h-4 w-4 rtl:-scale-x-100" />
            </a>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="rounded-2xl border border-border bg-surface/80 p-8 shadow-2xl shadow-black/40 backdrop-blur">
            <span className="font-mono-ui text-xs font-semibold uppercase tracking-widest text-accent-label">
              {t("highlightsTitle")}
            </span>
            <ul className="mt-6 space-y-4">
              {highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="flex items-center gap-3 text-base text-foreground"
                >
                  <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
