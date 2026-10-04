import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { Icon } from "@/components/Icon";
import { Cta, JsonLd, PageHead, StatusChip } from "@/components/PageHead";
import { getDict, href, toLocale } from "@/lib/i18n";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { projects } from "@/lib/site-config";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = toLocale((await params).locale);
  const t = await getDict(locale);
  return pageMetadata(locale, "/portfolio", t, t.meta.portfolio);
}

export default async function PortfolioPage({ params }: Props) {
  const locale = toLocale((await params).locale);
  setRequestLocale(locale);
  const t = await getDict(locale);
  const crumbs = [{ name: t.nav.portfolio, path: "/portfolio" }];

  return (
    <>
      <JsonLd data={breadcrumbSchema(locale, [{ name: t.nav.home, path: "/" }, ...crumbs])} />
      <PageHead
        locale={locale}
        t={t}
        title={t.portfolio.title}
        lead={t.portfolio.lead}
        crumbs={crumbs}
        waMessage={t.wa.general}
      />

      <section className="section">
        <div className="wrap">
          <ul className="project-grid">
            {projects.map((project) => {
              const p = t.portfolio.items[project.slug];
              return (
                <li key={project.slug}>
                  <Link className="card project-card" href={href(locale, `/portfolio/${project.slug}`)}>
                    <div className="project-card-top">
                      <span className="icon-badge">
                        <Icon name={project.icon} />
                      </span>
                      <StatusChip status={project.status} t={t} />
                    </div>
                    <h2>{p.title}</h2>
                    <p>{p.description}</p>
                    <ul className="chip-list">
                      {p.stack.map((item) => (
                        <li key={item} className="chip">
                          {item}
                        </li>
                      ))}
                    </ul>
                    <span className="more">
                      {t.common.details}
                      <Icon name="arrow" size={14} className="icon-dir" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <Cta t={t} title={t.portfolio.cta.title} text={t.portfolio.cta.text} waMessage={t.wa.general} />
    </>
  );
}
