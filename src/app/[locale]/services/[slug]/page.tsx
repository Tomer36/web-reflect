import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Icon } from "@/components/Icon";
import { Cta, JsonLd, PageHead } from "@/components/PageHead";
import { fill, getDict, href, locales, toLocale } from "@/lib/i18n";
import { breadcrumbSchema, pageMetadata, serviceSchema } from "@/lib/seo";
import { projects, services } from "@/lib/site-config";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) => services.map((service) => ({ locale, slug: service.slug })));
}

async function load({ params }: Props) {
  const { locale: rawLocale, slug } = await params;
  const locale = toLocale(rawLocale);
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();
  const t = await getDict(locale);
  return { locale, service, t, s: t.services.items[service.slug], path: `/services/${service.slug}` };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale, t, s, path } = await load(props);
  return pageMetadata(locale, path, t, {
    title: fill(t.meta.itemTitle, { name: s.name }),
    description: s.description,
  });
}

// One template for every service page.
export default async function ServicePage(props: Props) {
  const { locale, service, t, s, path } = await load(props);
  setRequestLocale(locale);
  const waMessage = fill(t.wa.service, { name: s.name });
  const crumbs = [
    { name: t.nav.services, path: "/services" },
    { name: s.name, path },
  ];
  const related = projects.filter((project) => project.service === service.slug);
  const others = services.filter((item) => item.slug !== service.slug);

  return (
    <>
      <JsonLd
        data={[
          serviceSchema(locale, { name: s.name, description: s.description, path }),
          breadcrumbSchema(locale, [{ name: t.nav.home, path: "/" }, ...crumbs]),
        ]}
      />
      <PageHead
        locale={locale}
        t={t}
        title={s.name}
        lead={s.lead}
        crumbs={crumbs}
        icon={service.icon}
        waMessage={waMessage}
      />

      <section className="section">
        <div className="wrap stack">
          <div className="card">
            <h2>{t.services.introTitle}</h2>
            <div className="prose">
              {s.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="split">
            <div className="card">
              <h2>{t.services.includesTitle}</h2>
              <ul className="check-list">
                {s.includes.map((item) => (
                  <li key={item}>
                    <Icon name="check" size={18} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card">
              <h2>{t.services.fitTitle}</h2>
              <ul className="check-list">
                {s.fit.map((item) => (
                  <li key={item}>
                    <Icon name="check" size={18} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {related.length > 0 && (
            <div className="card">
              <h2>{t.services.relatedTitle}</h2>
              <ul className="link-rows">
                {related.map((project) => (
                  <li key={project.slug}>
                    <Link className="link-row" href={href(locale, `/portfolio/${project.slug}`)}>
                      <span className="icon-badge">
                        <Icon name={project.icon} />
                      </span>
                      <span className="link-text">
                        <span className="value">{t.portfolio.items[project.slug].title}</span>
                      </span>
                      <Icon name="chevron" className="chev icon-dir" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <Cta
        t={t}
        title={fill(t.services.itemCta.title, { name: s.name })}
        text={t.services.itemCta.text}
        waMessage={waMessage}
      />

      <section className="section" aria-labelledby="other-title">
        <div className="wrap">
          <div className="section-head">
            <h2 id="other-title">{t.services.otherTitle}</h2>
          </div>
          <ul className="chip-list">
            {others.map((item) => (
              <li key={item.slug}>
                <Link className="chip chip-outline" href={href(locale, `/services/${item.slug}`)}>
                  <Icon name={item.icon} size={16} />
                  {t.services.items[item.slug].name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
