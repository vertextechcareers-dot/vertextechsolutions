/**
 * Post-build prerender. Takes dist/index.html and writes a static HTML file per public route
 * with its own <title>, meta tags, canonical, JSON-LD and real content inside #root, so crawlers
 * that don't run JavaScript (AI answer engines, SEO audit tools) see the actual page.
 * React replaces the #root content as soon as the app loads.
 * Also writes dist/sitemap.xml.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { SITE, SERVICE_LIST, FAQS } from "../src/data/site";
import { getSeo } from "../src/data/seo";
import { serviceDetails } from "../src/data/serviceDetails";

const dist = join(process.cwd(), "dist");
const template = readFileSync(join(dist, "index.html"), "utf8");

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const abs = (path: string) => SITE.url + (path === "/" ? "/" : path);
const ld = (obj: unknown) =>
  `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;

const orgId = `${SITE.url}/#organization`;

const organization = {
  "@context": "https://schema.org",
  "@type": ["Organization", "ProfessionalService"],
  "@id": orgId,
  name: SITE.name,
  url: SITE.url + "/",
  description: SITE.description,
  telephone: SITE.phone,
  email: SITE.email,
  image: `${SITE.url}/gebeya.webp`,
  address: { "@type": "PostalAddress", addressLocality: SITE.locality, addressCountry: SITE.countryCode },
  areaServed: { "@type": "Country", name: SITE.country },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    telephone: SITE.phone,
    email: SITE.email,
    areaServed: SITE.countryCode,
    availableLanguage: ["English"],
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Technology services",
    itemListElement: SERVICE_LIST.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.name, url: abs(`/services/${s.slug}`) },
    })),
  },
};

const website = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE.url}/#website`,
  url: SITE.url + "/",
  name: SITE.name,
  publisher: { "@id": orgId },
  inLanguage: "en-KE",
};

const faqPage = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const wrap = (inner: string) =>
  `<div style="background:#0B1120;color:#e2e8f0;min-height:100vh;padding:32px 20px;font-family:system-ui,sans-serif;line-height:1.6"><div style="max-width:860px;margin:0 auto">${inner}</div></div>`;

const nav = `<nav aria-label="Primary"><a href="/" style="color:#7dd3fc">Home</a> · <a href="/#about" style="color:#7dd3fc">About</a> · <a href="/#services" style="color:#7dd3fc">Services</a> · <a href="/#faq" style="color:#7dd3fc">FAQ</a> · <a href="/#contact" style="color:#7dd3fc">Contact</a></nav>`;

const contact = `<h2>Contact ${esc(SITE.name)}</h2><p>Phone: <a href="tel:${SITE.phone}" style="color:#7dd3fc">${esc(SITE.phoneDisplay)}</a><br>Email: <a href="mailto:${SITE.email}" style="color:#7dd3fc">${esc(SITE.email)}</a><br>Location: ${esc(SITE.locality)}, ${esc(SITE.country)}</p>`;

function homeContent() {
  return wrap(`${nav}
<h1>${esc(SITE.name)}: all-in-one tech solutions for modern businesses in Kenya</h1>
<p><strong>${esc(SITE.description)}</strong></p>
<h2 id="about">What is ${esc(SITE.name)}?</h2>
<p>We are based in ${esc(SITE.locality)}, ${esc(SITE.country)}, and we help businesses plan, build, secure and grow their digital products, from a first website or mobile app to AI-driven automation and cloud infrastructure.</p>
<h2 id="services">What we build for Kenyan businesses</h2>
<ul>${SERVICE_LIST.map((s) => `<li><a href="/services/${s.slug}" style="color:#7dd3fc">${esc(s.name)}</a></li>`).join("")}</ul>
<h2 id="faq">Frequently asked questions</h2>
${FAQS.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join("\n")}
${contact}`);
}

function serviceContent(slug: string) {
  const d = serviceDetails[slug];
  const list = (items?: string[]) => (items?.length ? `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>` : "");
  return wrap(`${nav}
<h1>${esc(d.title)} in Kenya</h1>
<p><strong>${esc(d.headline)}</strong></p>
<p>${esc(d.overview)}</p>
<h2>What you get</h2>${list(d.whatYouGet)}
${d.useCases?.length ? `<h2>Use cases</h2>${list(d.useCases)}` : ""}
${d.technologies?.length ? `<h2>Technologies we use</h2>${list(d.technologies)}` : ""}
${d.process?.length ? `<h2>Our process</h2><ol>${d.process.map((i) => `<li>${esc(i)}</li>`).join("")}</ol>` : ""}
${d.benefits?.length ? `<h2>Benefits</h2>${list(d.benefits)}` : ""}
${contact}`);
}

function render(path: string, content: string, extraLd: unknown[]) {
  const seo = getSeo(path);
  const url = abs(path);
  let html = template;
  const rep = (re: RegExp, to: string) => {
    if (!re.test(html)) throw new Error(`prerender: pattern not found ${re}`);
    html = html.replace(re, () => to);
  };
  rep(/<title>[\s\S]*?<\/title>/, `<title>${esc(seo.title)}</title>`);
  rep(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(seo.description)}" />`);
  rep(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />`);
  rep(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${url}" />`);
  rep(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${esc(seo.title)}" />`);
  rep(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${esc(seo.description)}" />`);
  rep(/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${esc(seo.title)}" />`);
  rep(/<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${esc(seo.description)}" />`);
  rep(/<!--PRERENDER_JSONLD-->/, [organization, ...extraLd].map(ld).join("\n    "));
  rep(/<!--PRERENDER_CONTENT-->/, content);
  return html;
}

function write(path: string, html: string) {
  if (path === "/") return writeFileSync(join(dist, "index.html"), html);
  const dir = join(dist, path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), html);
}

const urls: string[] = ["/"];
write("/", render("/", homeContent(), [website, faqPage]));

for (const slug of Object.keys(serviceDetails)) {
  const path = `/services/${slug}`;
  const d = serviceDetails[slug];
  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: d.title,
    description: d.overview,
    url: abs(path),
    provider: { "@id": orgId },
    areaServed: { "@type": "Country", name: SITE.country },
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: abs("/") },
      { "@type": "ListItem", position: 2, name: d.title, item: abs(path) },
    ],
  };
  write(path, render(path, serviceContent(slug), [service, breadcrumb]));
  urls.push(path);
}

// /privacy renders the app shell with proper meta only (its content is loaded dynamically).
write("/privacy", render("/privacy", wrap(`${nav}<h1>Privacy Policy</h1><p>How ${esc(SITE.name)} handles personal information and app privacy.</p>`), []));
urls.push("/privacy");

const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${abs(u)}</loc><lastmod>${today}</lastmod></url>`)
    .join("\n")}\n</urlset>\n`
);

console.log(`Prerendered ${urls.length} routes + sitemap.xml`);
