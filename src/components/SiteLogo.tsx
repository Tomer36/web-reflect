/* eslint-disable @next/next/no-img-element -- the files are already sized by scripts/build-images.mjs */
import images from "@/generated/images.json";

// Both variants are in the HTML and CSS shows the one that fits the theme
// (see .logo-light / .logo-dark), so there is no swap after hydration. The
// source logo's "WEB" lettering is white in the dark variant and near-black
// in the light one.
export function SiteLogo() {
  const { light, dark } = images.logo;
  return (
    <>
      <img className="logo-light" src={light.src} alt="Web Reflect" width={light.width} height={light.height} />
      <img
        className="logo-dark"
        src={dark.src}
        alt="Web Reflect"
        width={dark.width}
        height={dark.height}
        loading="lazy"
      />
    </>
  );
}
