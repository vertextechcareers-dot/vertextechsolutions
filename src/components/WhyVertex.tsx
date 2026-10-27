import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Award, Users, Rocket } from 'lucide-react';

const stats = [
  { label: 'Successful Projects', value: '250+', icon: <Rocket className="text-brand-blue" /> },
  { label: 'Happy Clients', value: '180+', icon: <Users className="text-brand-green" /> },
  { label: 'Certifications', value: '15+', icon: <Award className="text-brand-violet" /> },
];

const reasons = [
  {
    title: 'Expert Engineering',
    description: 'Our team consists of senior developers and architects with decades of combined experience.',
  },
  {
    title: 'Futuristic Approach',
    description: 'We leverage the latest AI and cloud technologies to keep your business ahead of the curve.',
  },
  {
    title: 'Uncompromised Security',
    description: 'Security is baked into our development process from day one, not added as an afterthought.',
  },
  {
    title: 'Client-Centric Growth',
    description: "We don't just build software; we build partnerships that drive real business results.",
  },
];

const WhyVertex = () => {
  return (
    <section id="why-vertex" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
            <h2 className="text-sm font-bold tracking-[0.2em] text-brand-blue uppercase mb-4">Why Choose Vertex</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-brand-navy mb-8 leading-tight">
              We bridge the gap between <span className="text-brand-green">innovation</span> and implementation.
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {reasons.map((reason, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4"
                >
                  <CheckCircle2 className="text-brand-green shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="font-bold text-brand-navy mb-2">{reason.title}</h4>
                    <p className="text-brand-slate text-sm leading-relaxed">{reason.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="lg:w-1/2 relative">
            <div className="relative z-10 grid grid-cols-1 gap-6">
              <div className="bg-brand-navy p-10 rounded-[2.5rem] text-white shadow-2xl">
                <div className="flex flex-col gap-10">
                  {stats.map((stat, i) => (
                    <div key={i} className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                        {React.cloneElement(stat.icon as React.ReactElement<any>, { size: 28 })}
                      </div>
                      <div>
                        <div className="text-3xl font-black mb-1">{stat.value}</div>
                        <div className="text-white/60 text-sm font-medium uppercase tracking-wider">{stat.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Background Decorative Circles */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] -z-10">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-blue/5 to-brand-green/5 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyVertex;