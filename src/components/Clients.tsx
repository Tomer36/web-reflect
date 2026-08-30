import Image from "next/image";
import { useTranslations } from "next-intl";
import { SectionHeading } from "./Services";

const CLIENT_LOGOS = [
  { src: "/clients/okal.jpg", width: 587, height: 585 },
  { src: "/clients/bakery.png", width: 976, height: 667 },
  {
    src: "/clients/Topcosmeticslogo_flat.png",
    width: 1563,
    height: 1563,
  },
  {
    src: "/clients/Cali-Armor-Logo-Horizontal-white.svg",
    width: 422,
    height: 70,
  },
];

export function Clients() {
  const t = useTranslations("clients");
  const items = t.raw("items") as string[];

  return (
    <section id="clients" className="border-b border-border bg-surface/40">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((client, index) => {
            const logo = CLIENT_LOGOS[index];

            return (
            <div
              key={client}
              className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-border bg-surface px-6 py-6 text-center transition-colors hover:border-accent/60"
            >
              <div
                className={`flex h-28 w-full items-center justify-center ${
                  logo.src.includes("Cali-Armor")
                    ? "rounded-lg bg-[#0c0d12] px-4 py-3"
                    : ""
                }`}
              >
                <Image
                  src={logo.src}
                  alt=""
                  width={logo.width}
                  height={logo.height}
                  className="max-h-full max-w-full w-auto object-contain"
                  unoptimized={logo.src.endsWith(".svg")}
                />
              </div>
              <span className="mt-4 font-mono-ui text-xs font-medium text-muted">
                {client}
              </span>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
