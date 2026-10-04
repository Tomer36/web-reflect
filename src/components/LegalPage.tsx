import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Footer } from "./Footer";
import { SiteLogo } from "./SiteLogo";

type LegalSection = { heading: string; paragraphs: string[] };

export function LegalPage({ title, intro, backLabel, sections }: { title: string; intro: string; backLabel: string; sections: LegalSection[] }) {
  return <div className="flex min-h-screen flex-col">
    <header className="border-b border-border"><div className="mx-auto flex h-16 max-w-4xl items-center px-5 sm:px-8"><Link href="/" aria-label="Web Reflect home" className="inline-flex items-center"><SiteLogo className="h-8 w-auto" /></Link></div></header>
    <main className="flex-1"><article className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-20">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"><ArrowLeft className="h-4 w-4 rtl:rotate-180" />{backLabel}</Link>
      <p className="mt-10 font-mono-ui text-xs uppercase tracking-[0.18em] text-accent-label">Web Reflect</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-muted">{intro}</p>
      <div className="mt-14 space-y-10">{sections.map((section) => <section key={section.heading}><h2 className="text-xl font-semibold tracking-tight">{section.heading}</h2><div className="mt-3 space-y-4 leading-7 text-muted">{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></section>)}</div>
    </article></main><Footer />
  </div>;
}
