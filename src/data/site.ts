// Single source of truth for business facts used by SEO, schema, FAQ and prerendering.
// Keep this file free of imports from "@/..." so the prerender script can load it.

export const SITE = {
  url: "https://vertextechsolutions-xi.vercel.app", // change when you add a custom domain
  name: "Vertex Tech Solutions",
  shortName: "Vertex",
  phone: "+254751936947",
  phoneDisplay: "+254 751 936 947",
  email: "info@vertextech.com",
  locality: "Nairobi",
  country: "Kenya",
  countryCode: "KE",
  tagline: "All-in-one tech solutions for modern businesses",
  description:
    "Vertex Tech Solutions is a Nairobi, Kenya-based technology company that designs and builds custom websites, mobile apps, SaaS platforms, cloud and DevOps infrastructure, AI applications, automation, cybersecurity and SEO services for businesses.",
};

export const SERVICE_LIST = [
  { name: "Custom Web Development", slug: "custom-web-development" },
  { name: "Mobile App Development", slug: "mobile-app-development" },
  { name: "SaaS Development", slug: "saas-development" },
  { name: "Cloud & DevOps", slug: "cloud-devops-services" },
  { name: "AI Application Services", slug: "ai-application-services" },
  { name: "Automation & AI Integration", slug: "automation-ai-integration" },
  { name: "Cybersecurity", slug: "cybersecurity" },
  { name: "SEO Services", slug: "seo-services" },
];

// Visible on the homepage AND emitted as FAQPage JSON-LD. Answers must stay identical in both places.
export const FAQS = [
  {
    q: "What does Vertex Tech Solutions do?",
    a: "Vertex Tech Solutions is a Nairobi, Kenya-based technology company that builds custom websites, mobile apps, SaaS platforms, cloud and DevOps infrastructure, AI applications, automation, cybersecurity and SEO services for businesses.",
  },
  {
    q: "Who does Vertex Tech Solutions serve in Kenya?",
    a: "We work with Kenyan businesses that need custom software, mobile apps, AI-driven automation or stronger online visibility and security, and we build each solution around the client's own goals.",
  },
  {
    q: "What services does Vertex Tech Solutions offer?",
    a: "Our services are custom web development, mobile app development, SaaS development, cloud and DevOps, AI application services, automation and AI integration, cybersecurity, and SEO.",
  },
  {
    q: "How much do Vertex Tech Solutions services cost?",
    a: "Pricing depends on the scope, features and timeline of your project, so we quote each project individually after understanding your requirements. Use the Start Your Project button or call +254 751 936 947 to request a quotation.",
  },
  {
    q: "How can I contact Vertex Tech Solutions or request a quotation?",
    a: "Call +254 751 936 947, email info@vertextech.com, or use the Start Your Project and contact forms on this website to describe your project and request a quotation.",
  },
  {
    q: "Where is Vertex Tech Solutions located?",
    a: "Vertex Tech Solutions is based in Nairobi, Kenya and works with businesses across Kenya.",
  },
  {
    q: "What is the process for working with Vertex Tech Solutions?",
    a: "Projects move through requirements analysis, prototyping and interface design, full-stack development, testing, and deployment, with security considered from the first stage.",
  },
];
