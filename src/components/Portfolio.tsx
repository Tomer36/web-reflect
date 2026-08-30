import { useTranslations } from "next-intl";
import { FileStack, Gift, ShoppingCart, TrendingUp, Users } from "lucide-react";
import { SectionHeading } from "./Services";

const ICONS = [ShoppingCart, Users, Gift, TrendingUp, FileStack];

type Project = {
  tag: string;
  title: string;
  status: "inProgress" | "live";
  description: string;
  stack: string[];
};

export function Portfolio() {
  const t = useTranslations("portfolio");
  const items = t.raw("items") as Project[];
  const [featured, ...rest] = items;

  return (
    <section id="portfolio" className="border-b border-border bg-surface/40">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <div className="mt-10 grid gap-6 sm:mt-12">
          <ProjectCard project={featured} Icon={ICONS[0]} t={t} featured />
          <div className="grid gap-6 md:grid-cols-2">
            {rest.map((project, i) => (
              <ProjectCard
                key={project.title}
                project={project}
                Icon={ICONS[i + 1]}
                t={t}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  Icon,
  t,
  featured = false,
}: {
  project: Project;
  Icon: React.ComponentType<{ className?: string }>;
  t: ReturnType<typeof useTranslations<"portfolio">>;
  featured?: boolean;
}) {
  const isLive = project.status === "live";

  return (
    <div
      className={`rounded-2xl border border-border bg-surface p-7 transition-colors hover:border-border-strong sm:p-8 ${
        featured ? "lg:flex lg:items-start lg:gap-10" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
          <Icon className="h-5 w-5" />
        </span>
        <div
          className={`inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 font-mono-ui text-[11px] text-muted ${
            featured ? "lg:hidden" : ""
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isLive ? "bg-signal" : "bg-warn"
            }`}
          />
          {isLive ? t("statusLive") : t("statusInProgress")}
        </div>
      </div>

      <div className={featured ? "lg:flex-1" : ""}>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="font-mono-ui text-xs uppercase tracking-widest text-muted">
            {project.tag}
          </span>
          <div
            className={`hidden items-center gap-1.5 rounded-full border border-border px-2.5 py-1 font-mono-ui text-[11px] text-muted ${
              featured ? "lg:inline-flex" : ""
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isLive ? "bg-signal" : "bg-warn"
              }`}
            />
            {isLive ? t("statusLive") : t("statusInProgress")}
          </div>
        </div>

        <h3 className="mt-2 text-xl font-semibold">{project.title}</h3>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          {project.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-border bg-background px-3 py-1 font-mono-ui text-[11px] text-muted"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
