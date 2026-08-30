import { useTranslations } from "next-intl";
import { SectionHeading } from "./Services";

export function Skills() {
  const t = useTranslations("skills");
  const items = t.raw("items") as string[];

  return (
    <section id="skills" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <div className="mt-10 flex flex-wrap gap-3 sm:mt-12">
          {items.map((skill) => (
            <span
              key={skill}
              className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground transition-colors hover:border-accent/60 hover:bg-accent-soft"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
