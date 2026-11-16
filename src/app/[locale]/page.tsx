/* eslint-disable @next/next/no-img-element -- logos are pre-sized by scripts/build-images.mjs */
import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { Icon, type IconName } from "@/components/Icon";
import { Cta, JsonLd, StatusChip } from "@/components/PageHead";
import images from "@/generated/images.json";
import { fill, getDict, href, locales, toLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { clients, projects, services, whatsappLink } from "@/lib/site-config";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = toLocale((await params).locale);
  const t = await getDict(locale);
  return pageMetadata(locale, "/", t, t.meta.home);
}

// One icon per "why us" item, in the order of home.why.items.
const WHY_ICONS: IconName[] = ["messages", "languages", "zap", "search", "accessibility", "puzzle"];


// The home page is a set of previews. Each one links to the page that holds
// the full content; nothing here is repeated there.
export default async function Home({ params }: Props) {
  const locale = toLocale((await params).locale);
  setRequestLocale(locale);
  const t = await getDict(locale);
  const { hero, stats, why, faq } = t.home;
  const logos = images.clients as Record<string, { src: string; width: number; height: number }>;

  // Counted from the site data, so the numbers stay true as it changes.
  const statItems = [
    { value: projects.length, label: stats.projects },
    { value: clients.length, label: stats.clients },
    { value: services.length, label: stats.services },
    { value: locales.length, label: stats.languages },
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.items.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }}
      />
      <section className="hero" aria-labelledby="hero-title">
        <div className="wrap hero-grid">
          <div>
            <p className="hero-kicker">
              {hero.title} — {hero.eyebrow}
            </p>
            <h1 id="hero-title">
              {hero.headline} <span className="hl">{hero.highlight}</span>
            </h1>
            <p className="lead">{hero.lead}</p>
            <div className="btn-row">
              <a className="btn btn-light btn-lg" href={whatsappLink(t.wa.general)} target="_blank" rel="noopener">
                <Icon name="whatsapp" />
                {t.nav.cta}
              </a>
              <Link className="btn btn-ghost-light btn-lg" href={href(locale, "/portfolio")}>
                {hero.secondary}
                <Icon name="arrow" className="icon-dir" />
              </Link>
            </div>
            <ul className="hero-trust">
              {hero.trust.map((item) => (
                <li key={item}>
                  <Icon name="check" size={18} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Decorative: three real projects between the braces of the logo,
              with their reflection underneath ("Web Reflect"). */}
          <div className="hero-braces" aria-hidden="true">
            <span className="brace">{"{"}</span>
            <ul className="brace-stack">
              {projects.slice(-3).map((project, i) => {
                const p = t.portfolio.items[project.slug];
                return (
                  <li key={project.slug} className={`accent-${(i + 1) % 5}`}>
                    <span className="icon-tile">
                      <Icon name={project.icon} size={22} />
                    </span>
                    <span className="brace-text">
                      <span className="eyebrow">{p.tag}</span>
                      <b>{p.title}</b>
                    </span>
                    <StatusChip status={project.status} t={t} />
                  </li>
                );
              })}
            </ul>
            <span className="brace">{"}"}</span>
          </div>
        </div>
      </section>

      <div className="wrap stats">
        <ul className="card">
          {statItems.map((item) => (
            <li key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <section className="logo-strip" aria-label={t.home.clients.title}>
        <div className="wrap">
          <p>{t.home.clients.title}</p>
          <ul>
            {clients.map((client) => {
              const logo = logos[client.key];
              const name = t.about.clients.items[client.key];
              return (
                <li key={client.key} className={client.dark ? "is-dark" : undefined}>
                  <img
                    src={logo.src}
                    alt={fill(t.about.clients.logoAlt, { name })}
                    width={logo.width}
                    height={logo.height}
                    loading="lazy"
                    decoding="async"
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="services-title">
        <div className="wrap">
          <div className="section-head center">
            <h2 id="services-title">{t.home.services.title}</h2>
            <p>{t.home.services.lead}</p>
          </div>
          <ul className="plan-grid">
            {services.map((service, i) => {
              const s = t.services.items[service.slug];
              return (
                <li key={service.slug}>
                  <Link className={`card plan-card lift accent-${i}`} href={href(locale, `/services/${service.slug}`)}>
                    <span className="icon-tile">
                      <Icon name={service.icon} size={26} />
                    </span>
                    <h3>{s.name}</h3>
                    <p>{s.short}</p>
                    <span className="btn btn-secondary btn-block">
                      {t.common.details}
                      <Icon name="arrow" className="icon-dir" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="section section-tint" aria-labelledby="why-title">
        <div className="wrap">
          <div className="section-head center">
            <h2 id="why-title">{why.title}</h2>
            <p>{why.lead}</p>
          </div>
          <ul className="feature-grid">
            {why.items.map((item, i) => (
              <li key={item.title} className={`feature lift accent-${i % 5}`}>
                <span className="icon-tile">
                  <Icon name={WHY_ICONS[i]} size={26} />
                </span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="portfolio-title">
        <div className="wrap">
          <div className="section-head center">
            <h2 id="portfolio-title">{t.home.portfolio.title}</h2>
            <p>{t.home.portfolio.lead}</p>
          </div>
          {/* The first three projects; the rest are on the portfolio page. */}
          <ul className="show-grid">
            {projects.slice(0, 3).map((project, i) => {
              const p = t.portfolio.items[project.slug];
              return (
                <li key={project.slug}>
                  <Link className={`card show-card lift accent-${i}`} href={href(locale, `/portfolio/${project.slug}`)}>
                    <div className="show-thumb">
                      <span className="icon-tile">
                        <Icon name={project.icon} size={28} />
                      </span>
                    </div>
                    <div className="show-body">
                      <div className="tile-top">
                        <span className="eyebrow">{p.tag}</span>
                        <StatusChip status={project.status} t={t} />
                      </div>
                      <h3>{p.title}</h3>
                      <span className="more">
                        {t.common.details}
                        <Icon name="arrow" size={16} className="icon-dir" />
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
          <div className="studio">
            <div>
              <h2 id="about-title">{t.home.about.title}</h2>
              <p>{t.home.about.text}</p>
            </div>
            <div className="studio-icons" aria-hidden="true">
              {(["app", "globe", "workflow", "dashboard"] as const).map((name, i) => (
                <span key={name} className={`icon-tile accent-${i}`}>
                  <Icon name={name} size={26} />
                </span>
              ))}
            </div>
            <Link className="btn btn-primary" href={href(locale, "/about")}>
              {t.home.about.more}
              <Icon name="arrow" className="icon-dir" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-tint" aria-labelledby="faq-title">
        <div className="wrap faq-layout">
          <div className="faq-intro">
            <h2 id="faq-title">{faq.title}</h2>
            <p>{faq.lead}</p>
            <a className="btn btn-primary desktop-only" href={whatsappLink(t.wa.general)} target="_blank" rel="noopener">
              <Icon name="whatsapp" />
              {t.nav.cta}
            </a>
          </div>
          <div className="faq-list">
            {faq.items.map((item, i) => (
              <details key={item.q} open={i === 0}>
                <summary>
                  <h3>{item.q}</h3>
                  <Icon name="plus" size={26} />
                </summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Cta t={t} title={t.home.cta.title} text={t.home.cta.text} waMessage={t.wa.general} />
    </>
  );
}
