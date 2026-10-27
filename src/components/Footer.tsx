import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white pt-20 pb-10 border-t border-brand-navy/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-green rounded-lg flex items-center justify-center">
                <span className="text-white text-2xl font-black font-heading">V</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-brand-navy font-black text-xl tracking-tight">VERTEX</span>
                <span className="text-brand-green font-medium text-[10px] tracking-[0.2em]">TECH SOLUTIONS</span>
              </div>
            </Link>
            <p className="text-brand-slate leading-relaxed mb-8">
              Empowering modern businesses with innovative, secure, and scalable technology solutions. From mobile apps to AI automation, we build the future.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Linkedin, Instagram, Github].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full border border-brand-navy/10 flex items-center justify-center text-brand-navy hover:bg-blue-green hover:text-white hover:border-transparent transition-all">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-brand-navy font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4 text-brand-slate">
              {['Home', 'Services', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <Link to={item === 'Home' ? '/' : `/#${item.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-brand-blue transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h4 className="text-brand-navy font-bold text-lg mb-6">Our Services</h4>
            <ul className="space-y-4 text-brand-slate">
              {[
                { name: 'Mobile Development', slug: 'mobile-app-development' },
                { name: 'Web Development', slug: 'custom-web-development' },
                { name: 'SEO Services', slug: 'seo-services' },
                { name: 'Cyber Security', slug: 'cybersecurity' },
                { name: 'AI Solutions', slug: 'ai-application-services' }
              ].map((service) => (
                <li key={service.name}>
                  <Link to={`/services/${service.slug}`} className="hover:text-brand-blue transition-colors">{service.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-brand-navy font-bold text-lg mb-6">Contact Info</h4>
            <ul className="space-y-4 text-brand-slate">
              <li>
                <p className="font-bold text-brand-navy">Phone</p>
                <a href="tel:+254751936947" className="hover:text-brand-blue transition-colors">+254 751 936 947</a>
              </li>
              <li>
                <p className="font-bold text-brand-navy">Email</p>
                <a href="mailto:info@vertextech.com" className="hover:text-brand-blue transition-colors">info@vertextech.com</a>
              </li>
              <li>
                <p className="font-bold text-brand-navy">Address</p>
                <p>Nairobi, Kenya</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-brand-navy/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-brand-slate text-sm">
            © {new Date().getFullYear()} Vertex Tech Solutions. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm text-brand-slate">
            <a href="#" className="hover:text-brand-blue">Privacy Policy</a>
            <a href="#" className="hover:text-brand-blue">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;