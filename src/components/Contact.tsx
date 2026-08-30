import { useTranslations } from "next-intl";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { SectionHeading } from "./Services";
import { siteConfig } from "@/lib/site-config";

export function Contact() {
  const t = useTranslations("contact");

  const directLinks = [
    {
      key: "email",
      icon: Mail,
      label: t("direct.email"),
      value: siteConfig.email,
      href: `mailto:${siteConfig.email}`,
    },
    {
      key: "phone",
      icon: Phone,
      label: t("direct.phone"),
      value: siteConfig.phoneDisplay,
      href: siteConfig.phoneHref,
    },
    {
      key: "whatsapp",
      icon: MessageCircle,
      label: t("direct.whatsapp"),
      value: siteConfig.phoneDisplay,
      href: siteConfig.whatsappHref,
    },
  ];

  return (
    <section id="contact">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-3">
          {directLinks.map((link) => (
            <a
              key={link.key}
              href={link.href}
              target={link.key === "whatsapp" ? "_blank" : undefined}
              rel={link.key === "whatsapp" ? "noopener noreferrer" : undefined}
              className="group flex flex-col items-start gap-4 rounded-2xl border border-border bg-surface p-7 transition-colors hover:border-accent/60"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <link.icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-xs text-muted">{link.label}</span>
                <span
                  dir="ltr"
                  className="mt-1 block text-lg font-medium text-foreground"
                >
                  {link.value}
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
