import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Hours } from "@/components/Hours";
import { Icon, type IconName } from "@/components/Icon";
import { JsonLd, PageHead } from "@/components/PageHead";
import { getDict, toLocale } from "@/lib/i18n";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { siteConfig, whatsappLink } from "@/lib/site-config";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = toLocale((await params).locale);
  const t = await getDict(locale);
  return pageMetadata(locale, "/contact", t, t.meta.contact);
}

// Address, opening hours and social cards appear once they are filled in
// in src/lib/site-config.ts.
export default async function ContactPage({ params }: Props) {
  const locale = toLocale((await params).locale);
  setRequestLocale(locale);
  const t = await getDict(locale);
  const { contact } = t;
  const crumbs = [{ name: t.nav.contact, path: "/contact" }];
  const { address, hours, social } = siteConfig;

  const tiles: { icon: IconName; label: string; sub: string; href: string; external?: boolean; ltr?: boolean }[] = [
    {
      icon: "whatsapp",
      label: contact.tiles.whatsapp,
      sub: siteConfig.phoneDisplay,
      href: whatsappLink(t.wa.general),
      external: true,
      ltr: true,
    },
    { icon: "phone", label: contact.tiles.phone, sub: siteConfig.phoneDisplay, href: siteConfig.phoneHref, ltr: true },
    { icon: "mail", label: contact.tiles.email, sub: siteConfig.email, href: `mailto:${siteConfig.email}`, ltr: true },
    ...(address
      ? [
          {
            icon: "navigate" as const,
            label: contact.tiles.navigate,
            sub: address[locale],
            href: address.wazeUrl ?? address.mapsUrl,
            external: true,
          },
        ]
      : []),
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(locale, [{ name: t.nav.home, path: "/" }, ...crumbs])} />
      <PageHead locale={locale} t={t} title={contact.title} lead={contact.lead} crumbs={crumbs} />

      <section className="section">
        <div className="wrap stack">
          <div className="split">
            <div className="card">
              <h2>{contact.detailsTitle}</h2>
              <ul className="contact-tiles">
                {tiles.map((tile) => (
                  <li key={tile.icon}>
                    <a
                      className="contact-tile"
                      href={tile.href}
                      {...(tile.external ? { target: "_blank", rel: "noopener" } : {})}
                    >
                      <span className="icon-badge">
                        <Icon name={tile.icon} />
                      </span>
                      <span className="tile-label">{tile.label}</span>
                      <span className="tile-sub">{tile.ltr ? <bdi dir="ltr">{tile.sub}</bdi> : tile.sub}</span>
                    </a>
                  </li>
                ))}
              </ul>
              {address && (
                <p className="contact-address">
                  <Icon name="pin" size={18} />
                  <a href={address.mapsUrl} target="_blank" rel="noopener">
                    <span className="sr-only">{contact.addressLabel}: </span>
                    {address[locale]}
                  </a>
                </p>
              )}
            </div>

            {hours.length > 0 ? (
              <div className="card">
                <h2>{contact.hoursTitle}</h2>
                <Hours locale={locale} t={t} />
              </div>
            ) : (
              <Brief title={contact.brief.title} items={contact.brief.items} />
            )}
          </div>

          {hours.length > 0 && <Brief title={contact.brief.title} items={contact.brief.items} />}

          {social.length > 0 && (
            <div>
              <h2 className="social-title">{contact.socialTitle}</h2>
              <ul className="social-cards">
                {social.map((item) => (
                  <li key={item.key}>
                    <a className="card social-card" href={item.url} target="_blank" rel="noopener">
                      <span className="icon-badge">
                        <Icon name={item.key} />
                      </span>
                      <span className="link-text">
                        <span className="value">{item.name}</span>
                        <span className="label">
                          <bdi dir="ltr">{item.handle}</bdi>
                        </span>
                      </span>
                      <Icon name="chevron" className="chev icon-dir" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function Brief({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <ul className="check-list">
        {items.map((item) => (
          <li key={item}>
            <Icon name="check" size={18} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
