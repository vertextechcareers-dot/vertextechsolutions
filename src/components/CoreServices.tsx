import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Smartphone, Globe, Cloud, Zap, Shield, Search, Cpu, Layers, Sparkles } from 'lucide-react';
import { useConsultation } from './ConsultationProvider';

const services = [
  {
    icon: <Smartphone className="text-brand-blue" />,
    title: "Mobile App Development",
    description: "Building high-performance, cross-platform mobile applications with seamless user experiences.",
    image: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/034db20f-fbb6-4bf7-aa6d-45a8f64978fc/mobile-app-development-4f419d1c-1782209040843.webp",
    color: "blue",
    tagline: "BUILD",
    slug: "mobile-app-development",
    benefits: ["iOS & Android", "Native Performance", "UX-First Design"]
  },
  {
    icon: <Globe className="text-brand-green" />,
    title: "Customized Web Development",
    description: "Scalable, secure, and responsive web solutions tailored to your unique business needs.",
    image: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/034db20f-fbb6-4bf7-aa6d-45a8f64978fc/custom-web-development-9ac4c317-1782209041980.webp",
    color: "green",
    tagline: "CREATE",
    slug: "custom-web-development",
    benefits: ["SEO Optimized", "Responsive", "Secure Backend"]
  },
  {
    icon: <Layers className="text-brand-violet" />,
    title: "SaaS Development",
    description: "End-to-end SaaS platforms with multi-tenant architecture and robust subscription models.",
    image: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/034db20f-fbb6-4bf7-aa6d-45a8f64978fc/saas-development-bdbd462e-1782209041806.webp",
    color: "violet",
    tagline: "SCALE",
    slug: "saas-development",
    benefits: ["Multi-tenant", "Subscription Ready", "Cloud Scalable"]
  },
  {
    icon: <Cloud className="text-brand-blue" />,
    title: "Cloud & DevOps",
    description: "Optimizing infrastructure for reliability, scalability, and automated deployments.",
    image: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/034db20f-fbb6-4bf7-aa6d-45a8f64978fc/cloud---devops-cac7eeec-1782209041792.webp",
    color: "blue",
    tagline: "DEPLOY",
    slug: "cloud-devops-services",
    benefits: ["AWS/Azure/GCP", "CI/CD Pipelines", "Auto-scaling"]
  },
  {
    icon: <Cpu className="text-brand-violet" />,
    title: "AI Application Services",
    description: "Integrating advanced AI models to drive intelligence and innovation in your apps.",
    image: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/034db20f-fbb6-4bf7-aa6d-45a8f64978fc/ai-application-services-0ed7f3fd-1782209042220.webp",
    color: "violet",
    tagline: "INTELLIGENT",
    slug: "ai-application-services",
    benefits: ["Machine Learning", "NLP Integration", "Predictive Analytics"]
  },
  {
    icon: <Zap className="text-brand-green" />,
    title: "Automation & AI Integration",
    description: "Streamlining workflows with intelligent automation and AI-driven process optimization.",
    image: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/034db20f-fbb6-4bf7-aa6d-45a8f64978fc/automation---ai-integration-3ecce55b-1782209041369.webp",
    color: "green",
    tagline: "AUTOMATE",
    slug: "automation-ai-integration",
    benefits: ["Workflow Automation", "Chatbot Solutions", "Efficiency Boost"]
  },
  {
    icon: <Shield className="text-brand-blue" />,
    title: "Cybersecurity",
    description: "Fortifying your digital assets with advanced threat detection and security protocols.",
    image: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/034db20f-fbb6-4bf7-aa6d-45a8f64978fc/cybersecurity-0c662606-1782209041489.webp",
    color: "blue",
    tagline: "SECURE",
    slug: "cybersecurity",
    benefits: ["Threat Audits", "Data Encryption", "Compliance Ready"]
  },
  {
    icon: <Search className="text-brand-green" />,
    title: "SEO Services",
    description: "Data-driven strategies to boost your online visibility and drive organic growth.",
    image: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/034db20f-fbb6-4bf7-aa6d-45a8f64978fc/seo-services-5f9bc7c9-1782209042269.webp",
    color: "green",
    tagline: "GROW",
    slug: "seo-services",
    benefits: ["Keyword Strategy", "Content Audit", "Ranking Growth"]
  }
];

const BackgroundElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Primary Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1E7FD808_1px,transparent_1px),linear-gradient(to_bottom,#1E7FD808_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      {/* Secondary Fine Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3DBE5B05_1px,transparent_1px),linear-gradient(to_bottom,#3DBE5B05_1px,transparent_1px)] bg-[size:20px_20px]" />
      
      {/* Animated Light Streaks */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`streak-${i}`}
          animate={{
            x: ['-100%', '200%'],
            opacity: [0, 0.3, 0]
          }}
          transition={{
            duration: 12 + i * 2,
            repeat: Infinity,
            ease: "linear",
            delay: i * 4
          }}
          className="absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-blue/40 to-transparent"
          style={{ top: `${20 + i * 25}%` }}
        />
      ))}

      {/* Vertical Streaks */}
      <motion.div
        animate={{
          y: ['-100%', '200%'],
          opacity: [0, 0.2, 0]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-0 left-1/4 h-full w-[1px] bg-gradient-to-b from-transparent via-brand-green/30 to-transparent"
      />
      
      {/* Floating Particles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          initial={{ 
            x: Math.random() * 100 + '%', 
            y: Math.random() * 100 + '%',
            opacity: Math.random() * 0.3
          }}
          animate={{
            y: [null, '-20%', '20%'],
            opacity: [0.1, 0.4, 0.1],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute w-1 h-1 rounded-full blur-[1px] ${
            i % 3 === 0 ? 'bg-brand-blue' : i % 3 === 1 ? 'bg-brand-green' : 'bg-brand-violet'
          }`}
        />
      ))}

      {/* Wave Pattern Mask */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#0B1120] to-transparent z-0" />
    </div>
  );
};

const ServiceCard = ({ service, index }: { service: typeof services[0], index: number }) => {
  const navigate = useNavigate();
  
  const getColorClasses = (color: string) => {
    switch(color) {
      case 'green': return { text: 'text-brand-green', from: 'from-brand-green/20', border: 'group-hover:border-brand-green/30', bg: 'bg-brand-green' };
      case 'violet': return { text: 'text-brand-violet', from: 'from-brand-violet/20', border: 'group-hover:border-brand-violet/30', bg: 'bg-brand-violet' };
      default: return { text: 'text-brand-blue', from: 'from-brand-blue/20', border: 'group-hover:border-brand-blue/30', bg: 'bg-brand-blue' };
    }
  };

  const c = getColorClasses(service.color);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -12 }}
      className="group relative h-full flex flex-col"
    >
      {/* Card Base */}
      <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] transition-all duration-500 group-hover:bg-white/[0.06] group-hover:border-white/20 z-10" />
      
      {/* Inner Glow Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${c.from} to-transparent rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10`} />

      {/* Content Container */}
      <div className="relative p-8 flex flex-col h-full z-20">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex flex-col">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '2rem' }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
              className={`h-[2px] rounded-full bg-gradient-to-r from-current to-transparent ${c.text} mb-2`}
            />
            <span className={`text-[10px] font-bold tracking-[0.3em] uppercase ${c.text}`}>
              {service.tagline}
            </span>
          </div>
          
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 shadow-xl"
          >
            {React.cloneElement(service.icon as React.ReactElement<any>, { size: 24 })}
          </motion.div>
        </div>

        {/* Image/Illustration Section */}
        <div className="relative mb-8 h-48 flex items-center justify-center rounded-3xl overflow-hidden group/img">
          {/* Background decoration for image */}
          <div className={`absolute inset-0 bg-gradient-to-tr ${c.from} to-transparent opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-700`} />
          
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 2, 0]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="w-full h-full relative p-4"
          >
            <img 
              src={service.image} 
              alt={service.title}
              className="w-full h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-700"
            />
          </motion.div>
        </div>

        {/* Text Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/60 transition-all duration-300">
            {service.title}
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 group-hover:text-slate-300 transition-colors duration-300">
            {service.description}
          </p>
        </div>

        {/* Benefits List */}
        <div className="space-y-2 mb-8 mt-auto">
          {service.benefits.map((benefit, i) => (
            <div key={i} className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
              <div className={`w-1 h-1 rounded-full ${c.bg}`} />
              {benefit}
            </div>
          ))}
        </div>

        {/* Action Button */}
        <button 
          onClick={() => navigate(`/services/${service.slug}`)}
          className="flex items-center gap-3 text-sm font-bold text-white group/btn relative w-fit"
        >
          <span className="relative z-10">Explore Solution</span>
          <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover/btn:w-full" />
          <motion.div
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowRight size={16} className={`transition-transform duration-300 group-hover/btn:translate-x-1 ${c.text}`} />
          </motion.div>
        </button>
      </div>

      {/* Neon Glow Bottom */}
      <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-8 blur-2xl opacity-0 group-hover:opacity-40 transition-all duration-700 -z-10 ${c.bg}`} />
    </motion.div>
  );
};

const CoreServices = () => {
  const { openConsultation } = useConsultation();
  return (
    <section id="services" className="py-32 bg-[#0B1120] relative overflow-hidden">
      <BackgroundElements />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md"
          >
            <Sparkles size={14} className="text-brand-blue animate-pulse" />
            <span className="text-brand-blue font-bold tracking-[0.3em] uppercase text-[10px]">Vertex Ecosystem</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-6xl text-white font-bold mb-6 max-w-3xl leading-tight"
          >
            Engineered for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-green to-brand-violet">Digital Frontier.</span>
          </motion.h2>
          
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '80px' }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 1 }}
            className="h-1 bg-gradient-to-r from-brand-blue to-brand-green rounded-full mb-8"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-slate-400 max-w-2xl text-lg leading-relaxed"
          >
            We transform complex challenges into high-performance digital systems using cutting-edge architecture and intelligent design.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>

        {/* Glowing Divider */}
        <div className="mt-32 relative">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <motion.div 
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-brand-blue blur-md" 
          />
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mt-20 text-center"
        >
          <div className="inline-flex flex-col items-center gap-6 p-10 rounded-[2rem] bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 backdrop-blur-xl">
            <p className="text-slate-400 text-lg max-w-lg">
              Not sure which solution fits your vision? Let's talk it through.
            </p>
            <button
              onClick={() => openConsultation()}
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-brand-blue to-brand-green text-white font-bold text-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-brand-blue/25"
            >
              <span className="relative z-10">Get a Free Consultation</span>
              <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-blue via-brand-green to-brand-violet opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CoreServices;