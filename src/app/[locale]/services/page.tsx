import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { Icon } from "@/components/Icon";
import { Cta, JsonLd, PageHead } from "@/components/PageHead";
import { getDict, href, toLocale } from "@/lib/i18n";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { services } from "@/lib/site-config";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = toLocale((await params).locale);
  const t = await getDict(locale);
  return pageMetadata(locale, "/services", t, t.meta.services);
}

export default async function ServicesPage({ params }: Props) {
  const locale = toLocale((await params).locale);
  setRequestLocale(locale);
  const t = await getDict(locale);
  const crumbs = [{ name: t.nav.services, path: "/services" }];

  return (
    <>
      <JsonLd data={breadcrumbSchema(locale, [{ name: t.nav.home, path: "/" }, ...crumbs])} />
      <PageHead
        locale={locale}
        t={t}
        title={t.services.title}
        lead={t.services.lead}
        crumbs={crumbs}
        waMessage={t.wa.general}
      />

      <section className="section">
        <div className="wrap">
          <ul className="rows">
            {services.map((service) => {
              const s = t.services.items[service.slug];
              return (
                <li key={service.slug}>
                  <Link className="card row-card" href={href(locale, `/services/${service.slug}`)}>
                    <span className="icon-badge">
                      <Icon name={service.icon} size={24} />
                    </span>
                    <div className="row-body">
                      <h2>{s.name}</h2>
                      <p className="row-text">{s.description}</p>
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

      <Cta t={t} title={t.services.cta.title} text={t.services.cta.text} waMessage={t.wa.general} />
    </>
  );
}
