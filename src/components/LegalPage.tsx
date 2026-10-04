import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { JsonLd, PageHead } from "@/components/PageHead";
import { fill, getDict, toLocale } from "@/lib/i18n";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

type Kind = "accessibility" | "privacy" | "terms";
type Props = { params: Promise<{ locale: string }> };

const PATHS: Record<Kind, string> = {
  accessibility: "/accessibility",
  privacy: "/privacy-policy",
  terms: "/terms-of-use",
};

// One template for the three legal pages. Text: legal.* in messages/*.json.
export function legalMetadata(kind: Kind) {
  return async function generateMetadata({ params }: Props): Promise<Metadata> {
    const locale = toLocale((await params).locale);
    const t = await getDict(locale);
    return pageMetadata(locale, PATHS[kind], t, t.meta[kind]);
  };
}

export function legalPage(kind: Kind) {
  return async function LegalPage({ params }: Props) {
    const locale = toLocale((await params).locale);
    setRequestLocale(locale);
    const t = await getDict(locale);
    const doc = t.legal[kind];
    const crumbs = [{ name: doc.title, path: PATHS[kind] }];
    const text = (value: string) => fill(value, { email: siteConfig.email });

    return (
      <>
        <JsonLd data={breadcrumbSchema(locale, [{ name: t.nav.home, path: "/" }, ...crumbs])} />
        <PageHead locale={locale} t={t} title={doc.title} lead={text(doc.intro)} crumbs={crumbs} />
        <section className="section">
          <div className="wrap">
            <article className="card legal">
              {doc.sections.map((section) => (
                <section key={section.heading}>
                  <h2>{section.heading}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{text(paragraph)}</p>
                  ))}
                </section>
              ))}
            </article>
          </div>
        </section>
      </>
    );
  };
}
