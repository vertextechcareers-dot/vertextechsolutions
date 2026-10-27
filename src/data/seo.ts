import { serviceDetails } from "./serviceDetails";
import { SITE } from "./site";

export interface SeoMeta {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}

function trim(text: string, max = 155) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,.;:]$/, "") + "…";
}

export const HOME_SEO: SeoMeta = {
  title: "Vertex Tech Solutions | Software & AI Company in Nairobi, Kenya",
  description:
    "Nairobi-based tech company building web and mobile apps, SaaS, AI automation, cloud and cybersecurity for businesses in Kenya. Request a consultation.",
  path: "/",
};

export function getSeo(pathname: string): SeoMeta {
  const path = pathname.replace(/\/+$/, "") || "/";

  if (path === "/") return HOME_SEO;

  if (path.startsWith("/services/")) {
    const detail = serviceDetails[path.replace("/services/", "")];
    if (detail) {
      return {
        title: `${detail.title} in Kenya | ${SITE.name}`,
        description: trim(`${detail.title} in Nairobi, Kenya. ${detail.overview}`),
        path,
      };
    }
  }

  if (path === "/privacy") {
    return {
      title: `Privacy Policy | ${SITE.name}`,
      description: `How ${SITE.name} handles personal information and app privacy.`,
      path,
    };
  }

  // Everything else (admin, downloads, app policies, unknown routes) stays out of search results.
  return { title: SITE.name, description: HOME_SEO.description, path, noindex: true };
}
