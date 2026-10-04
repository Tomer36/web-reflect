import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Gallery } from "@/components/Gallery";
import { Icon } from "@/components/Icon";
import { Cta, JsonLd, PageHead, StatusChip } from "@/components/PageHead";
import images from "@/generated/images.json";
import { fill, getDict, href, locales, toLocale } from "@/lib/i18n";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { projects } from "@/lib/site-config";

type Props = { params: Promise<{ locale: string; slug: string }> };
type Shot = { key: string; thumb: string; large: string; width: number; height: number };

export function generateStaticParams() {
  return locales.flatMap((locale) => projects.map((project) => ({ locale, slug: project.slug })));
}

async function load({ params }: Props) {
  const { locale: rawLocale, slug } = await params;
  const locale = toLocale(rawLocale);
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  const t = await getDict(locale);
  return { locale, project, t, p: t.portfolio.items[project.slug], path: `/portfolio/${project.slug}` };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale, t, p, path } = await load(props);
  return pageMetadata(locale, path, t, {
    title: fill(t.meta.itemTitle, { name: p.title }),
    description: p.description,
  });
}

// One template for every project page.
export default async function ProjectPage(props: Props) {
  const { locale, project, t, p, path } = await load(props);
  setRequestLocale(locale);
  const waMessage = fill(t.wa.project, { name: p.title });
  const crumbs = [
    { name: t.nav.portfolio, path: "/portfolio" },
    { name: p.title, path },
  ];
  // Screenshots: every image in content/portfolio/<slug>/, in file-name order.
  const shots = ((images.portfolio as Record<string, Shot[]>)[project.slug] ?? []).map((shot, i) => ({
    ...shot,
    alt: fill(t.common.imageAlt, { title: p.title, n: i + 1 }),
  }));
  const others = projects.filter((item) => item.slug !== project.slug);

  return (
    <>
      <JsonLd data={breadcrumbSchema(locale, [{ name: t.nav.home, path: "/" }, ...crumbs])} />
      <PageHead
        locale={locale}
        t={t}
        title={p.title}
        lead={p.lead}
        crumbs={crumbs}
        badge={<StatusChip status={project.status} t={t} />}
        waMessage={waMessage}
      />

      <section className="section">
        <div className="wrap stack">
          <div className="split split-wide">
            <div className="card">
              <h2>{t.portfolio.factsTitle}</h2>
              <dl className="facts">
                <div>
                  <dt>{t.portfolio.typeLabel}</dt>
                  <dd>{p.tag}</dd>
                </div>
                <div>
                  <dt>{t.portfolio.statusLabel}</dt>
                  <dd>{project.status === "live" ? t.common.live : t.common.inProgress}</dd>
                </div>
                <div>
                  <dt>{t.portfolio.serviceLabel}</dt>
                  <dd>
                    <Link href={href(locale, `/services/${project.service}`)}>
                      {t.services.items[project.service].name}
                    </Link>
                  </dd>
                </div>
              </dl>
              <ul className="chip-list">
                {p.stack.map((item) => (
                  <li key={item} className="chip">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card">
              <h2>{t.portfolio.overviewTitle}</h2>
              <div className="prose">
                {p.overview.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <h2>{t.portfolio.featuresTitle}</h2>
            <ul className="check-list">
              {p.features.map((item) => (
                <li key={item}>
                  <Icon name="check" size={18} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {shots.length > 0 && (
        <section className="section" aria-labelledby="gallery-title">
          <div className="wrap">
            <div className="section-head">
              <h2 id="gallery-title">{t.portfolio.galleryTitle}</h2>
            </div>
            <Gallery
              photos={shots}
              labels={{
                zoom: t.common.zoom,
                close: t.common.close,
                prev: t.common.prev,
                next: t.common.next,
                viewer: t.common.viewer,
              }}
            />
          </div>
        </section>
      )}

      <Cta t={t} title={t.portfolio.itemCta.title} text={t.portfolio.itemCta.text} waMessage={waMessage} />

      <section className="section" aria-labelledby="other-title">
        <div className="wrap">
          <div className="section-head">
            <h2 id="other-title">{t.portfolio.otherTitle}</h2>
          </div>
          <ul className="chip-list">
            {others.map((item) => (
              <li key={item.slug}>
                <Link className="chip chip-outline" href={href(locale, `/portfolio/${item.slug}`)}>
                  <Icon name={item.icon} size={16} />
                  {t.portfolio.items[item.slug].title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
