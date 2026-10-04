/* eslint-disable @next/next/no-img-element -- logos are pre-sized by scripts/build-images.mjs */
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Cta, JsonLd, PageHead } from "@/components/PageHead";
import images from "@/generated/images.json";
import { fill, getDict, toLocale } from "@/lib/i18n";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { clients } from "@/lib/site-config";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = toLocale((await params).locale);
  const t = await getDict(locale);
  return pageMetadata(locale, "/about", t, t.meta.about);
}

export default async function AboutPage({ params }: Props) {
  const locale = toLocale((await params).locale);
  setRequestLocale(locale);
  const t = await getDict(locale);
  const { about } = t;
  const crumbs = [{ name: t.nav.about, path: "/about" }];
  const logos = images.clients as Record<string, { src: string; width: number; height: number }>;

  return (
    <>
      <JsonLd data={breadcrumbSchema(locale, [{ name: t.nav.home, path: "/" }, ...crumbs])} />
      <PageHead
        locale={locale}
        t={t}
        title={about.title}
        lead={about.lead}
        crumbs={crumbs}
        waMessage={t.wa.general}
      />

      <section className="section">
        <div className="wrap stack">
          <div className="split">
            <div className="card">
              <h2>{about.story.title}</h2>
              <div className="prose">
                {about.story.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
            <div className="card">
              <h2>{about.process.title}</h2>
              <ol className="steps">
                {about.process.steps.map((step) => (
                  <li key={step.title}>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="card">
            <h2>{about.capabilities.title}</h2>
            <p>{about.capabilities.lead}</p>
            <ul className="chip-list">
              {about.capabilities.items.map((item) => (
                <li key={item} className="chip">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="clients-title">
        <div className="wrap">
          <div className="section-head">
            <h2 id="clients-title">{about.clients.title}</h2>
            <p>{about.clients.lead}</p>
          </div>
          <ul className="client-grid">
            {clients.map((client) => {
              const name = about.clients.items[client.key];
              const logo = logos[client.key];
              return (
                <li key={client.key} className="card client">
                  <span className={client.dark ? "client-logo is-dark" : "client-logo"}>
                    <img
                      src={logo.src}
                      alt={fill(about.clients.logoAlt, { name })}
                      width={logo.width}
                      height={logo.height}
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                  <span className="client-name">{name}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <Cta t={t} title={about.cta.title} text={about.cta.text} waMessage={t.wa.general} />
    </>
  );
}
