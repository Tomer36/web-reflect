import { useTranslations } from "next-intl";
import { AppWindow, Globe, Workflow } from "lucide-react";

const ICONS = [AppWindow, Globe, Workflow];

export function Services() {
  const t = useTranslations("services");
  const items = t.raw("items") as { title: string; description: string }[];

  return (
    <section id="services" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <div className="mt-10 grid gap-6 sm:mt-12 md:grid-cols-3">
          {items.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <div
                key={item.title}
                className="group rounded-2xl border border-border bg-surface p-7 transition-colors hover:border-border-strong"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-mono-ui text-xs text-muted">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="max-w-2xl">
      <span className="font-mono-ui text-xs font-semibold uppercase tracking-widest text-accent-label">
        {eyebrow}
      </span>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      <p className="text-balance mt-4 leading-relaxed text-muted">
        {subtitle}
      </p>
    </div>
  );
}
