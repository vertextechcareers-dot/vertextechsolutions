import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, Zap, Layers, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { useConsultation } from './ConsultationProvider';

const advancedServices = [
  {
    title: "Cloud & DevOps Services",
    accent: "brand-blue",
    icon: <Cloud size={40} />,
    description: "Cloud setup (AWS, Azure, Google Cloud), server management & scaling, and CI/CD automation.",
    features: ["Cloud Infrastructure Setup", "Server Scaling & Management", "DevOps Consulting (CI/CD)"],
    tagline: "Build. Deploy. Scale. We make the cloud work for you."
  },
  {
    title: "Automation & AI Integration",
    accent: "brand-green",
    icon: <Zap size={40} />,
    description: "Intelligent chatbots, CRM automation, process automation (RPA), and predictive analytics.",
    features: ["Chatbots & AI Support", "Process Automation (RPA)", "Workflow Optimization", "Predictive Insights"],
    tagline: "Automate. Optimize. Elevate. Work smarter, not harder."
  },
  {
    title: "SaaS Development",
    accent: "brand-violet",
    icon: <Layers size={40} />,
    description: "Custom SaaS platforms with multi-tenant architecture, billing systems, and admin dashboards.",
    features: ["Multi-tenant Architecture", "Subscription & Billing", "Scalable Admin Dashboards"],
    tagline: "Build once. Scale infinitely. Empower your users."
  }
];

const AdvancedServices = () => {
  const { openConsultation } = useConsultation();
  return (
    <section id="advanced" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-brand-blue font-bold tracking-[0.2em] uppercase text-sm">Advanced Solutions</span>
            <h2 className="text-4xl md:text-5xl text-brand-navy mt-4 mb-4">Enterprise-grade tech for scale.</h2>
            <p className="text-brand-slate text-lg">Pushing the boundaries of what's possible with specialized services designed for growth.</p>
          </div>
          <Button variant="outline" className="rounded-full px-8" onClick={() => openConsultation()}>Get a Free Consultation</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {advancedServices.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative overflow-hidden p-10 rounded-[2rem] bg-brand-navy text-white group`}
            >
              {/* Accent Gradient Glow */}
              <div className={`absolute -top-24 -right-24 w-64 h-64 opacity-20 blur-[80px] rounded-full transition-transform duration-700 group-hover:scale-150
                ${service.accent === 'brand-blue' ? 'bg-brand-blue' : service.accent === 'brand-green' ? 'bg-brand-green' : 'bg-brand-violet'}`} 
              />
              
              <div className={`mb-8 w-16 h-16 rounded-2xl flex items-center justify-center
                ${service.accent === 'brand-blue' ? 'bg-brand-blue/20 text-brand-blue' : service.accent === 'brand-green' ? 'bg-brand-green/20 text-brand-green' : 'bg-brand-violet/20 text-brand-violet'}`}>
                {service.icon}
              </div>

              <h3 className="text-3xl font-bold mb-4">{service.title}</h3>
              <p className="text-slate-400 mb-8 leading-relaxed">{service.description}</p>
              
              <ul className="space-y-4 mb-10">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 size={20} className={
                      service.accent === 'brand-blue' ? 'text-brand-blue' : service.accent === 'brand-green' ? 'text-brand-green' : 'text-brand-violet'
                    } />
                    <span className="text-sm font-medium text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className={`mt-auto pt-8 border-t border-white/10`}>
                <p className={`font-bold italic ${
                  service.accent === 'brand-blue' ? 'text-brand-blue' : service.accent === 'brand-green' ? 'text-brand-green' : 'text-brand-violet'
                }`}>"{service.tagline}"</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdvancedServices;