import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { Icon } from "@/components/Icon";
import { Cta, StatusChip } from "@/components/PageHead";
import { getDict, href, toLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { projects, services, whatsappLink } from "@/lib/site-config";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = toLocale((await params).locale);
  const t = await getDict(locale);
  return pageMetadata(locale, "/", t, t.meta.home);
}

// The home page is a set of previews. Each one links to the page that holds
// the full content; nothing here is repeated there.
export default async function Home({ params }: Props) {
  const locale = toLocale((await params).locale);
  setRequestLocale(locale);
  const t = await getDict(locale);
  const { hero } = t.home;

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="wrap hero-grid">
          <div>
            <h1 id="hero-title">
              {hero.title}
              <span>{hero.eyebrow}</span>
            </h1>
            <p className="lead">{hero.lead}</p>
            <div className="btn-row">
              <a className="btn btn-primary" href={whatsappLink(t.wa.general)} target="_blank" rel="noopener">
                <Icon name="whatsapp" />
                {t.nav.cta}
              </a>
              <Link className="btn btn-secondary" href={href(locale, "/portfolio")}>
                {hero.secondary}
                <Icon name="arrow" className="icon-dir" />
              </Link>
            </div>
          </div>
          <div className="card">
            <h2>{hero.highlightsTitle}</h2>
            <ul className="hero-list">
              {hero.highlights.map((item) => (
                <li key={item}>
                  <Icon name="check" size={18} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="services-title">
        <div className="wrap">
          <div className="section-head">
            <h2 id="services-title">{t.home.services.title}</h2>
            <p>{t.home.services.lead}</p>
          </div>
          <ul className="tile-grid">
            {services.map((service) => {
              const s = t.services.items[service.slug];
              return (
                <li key={service.slug}>
                  <Link className="card tile" href={href(locale, `/services/${service.slug}`)}>
                    <span className="icon-badge">
                      <Icon name={service.icon} />
                    </span>
                    <div className="tile-body">
                      <h3>{s.name}</h3>
                      <p>{s.short}</p>
                      <span className="more">
                        {t.common.details}
                        <Icon name="arrow" size={14} className="icon-dir" />
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="portfolio-title">
        <div className="wrap">
          <div className="section-head">
            <h2 id="portfolio-title">{t.home.portfolio.title}</h2>
            <p>{t.home.portfolio.lead}</p>
          </div>
          {/* The first three projects; the rest are on the portfolio page. */}
          <ul className="tile-grid">
            {projects.slice(0, 3).map((project) => {
              const p = t.portfolio.items[project.slug];
              return (
                <li key={project.slug}>
                  <Link className="card tile" href={href(locale, `/portfolio/${project.slug}`)}>
                    <div className="tile-body">
                      <div className="tile-top">
                        <span className="eyebrow">{p.tag}</span>
                        <StatusChip status={project.status} t={t} />
                      </div>
                      <h3>{p.title}</h3>
                      <span className="more">
                        {t.common.details}
                        <Icon name="arrow" size={14} className="icon-dir" />
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="section-more">
            <Link className="btn btn-secondary" href={href(locale, "/portfolio")}>
              {t.home.portfolio.all}
              <Icon name="arrow" className="icon-dir" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="about-title">
        <div className="wrap">
          <div className="card card-muted cta">
            <div>
              <h2 id="about-title">{t.home.about.title}</h2>
              <p>{t.home.about.text}</p>
            </div>
            <Link className="btn btn-secondary" href={href(locale, "/about")}>
              {t.home.about.more}
              <Icon name="arrow" className="icon-dir" />
            </Link>
          </div>
        </div>
      </section>

      <Cta t={t} title={t.home.cta.title} text={t.home.cta.text} waMessage={t.wa.general} />
    </>
  );
}
