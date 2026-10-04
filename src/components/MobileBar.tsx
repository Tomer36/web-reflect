import { siteConfig, whatsappLink } from "@/lib/site-config";
import type { Messages } from "@/lib/i18n";
import { Icon } from "./Icon";

// Phones: the one place to get in touch, always within reach.
export function MobileBar({ t }: { t: Messages }) {
  return (
    <div className="mobile-bar">
      <a className="btn btn-primary" href={whatsappLink(t.wa.general)} target="_blank" rel="noopener">
        <Icon name="whatsapp" />
        {t.common.whatsapp}
      </a>
      <a className="btn btn-secondary" href={siteConfig.phoneHref}>
        <Icon name="phone" />
        {t.common.call}
      </a>
    </div>
  );
}
