import { Link } from "react-router-dom";
import { SERVICE_LIST, SITE } from "@/data/site";

const AboutSection = () => (
  <section id="about" className="py-24 bg-white">
    <div className="container mx-auto px-4 max-w-5xl">
      <h2 className="text-3xl md:text-5xl font-bold text-brand-navy mb-6 leading-tight">
        What is Vertex Tech Solutions?
      </h2>
      <p className="text-brand-navy text-lg md:text-xl leading-relaxed mb-6">
        {SITE.description}
      </p>
      <p className="text-brand-slate text-lg leading-relaxed mb-10">
        We are based in {SITE.locality}, {SITE.country}, and we help businesses plan, build, secure and grow their
        digital products, from a first website or mobile app to AI-driven automation and cloud infrastructure.
      </p>
      <h3 className="text-xl font-bold text-brand-navy mb-4">What we build for Kenyan businesses</h3>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-brand-slate">
        {SERVICE_LIST.map((s) => (
          <li key={s.slug}>
            <Link to={`/services/${s.slug}`} className="text-brand-blue hover:underline font-medium">
              {s.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default AboutSection;
