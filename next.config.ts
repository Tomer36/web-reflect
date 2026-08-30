import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Lets the dev server (and its HMR websocket + JS chunks) be requested
  // from this machine's Tailscale/LAN IP, not just localhost.
  allowedDevOrigins: ["100.102.88.107"],
  // Static export — the site has no server-only feature (no API routes,
  // no middleware) left, so it deploys as plain files to any host,
  // including basic shared hosting with no Node.js support.
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
