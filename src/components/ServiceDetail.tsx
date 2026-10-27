import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { serviceDetails } from '../data/serviceDetails';
import { CheckCircle2, ArrowLeft, Phone, Mail, MessageSquare, Sparkles, Zap, Shield, Cpu, Target, Rocket } from 'lucide-react';
import { Button } from './ui/button';
import { useConsultation } from './ConsultationProvider';

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const detail = slug ? serviceDetails[slug] : null;
  const { openConsultation } = useConsultation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!detail) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex flex-col items-center justify-center text-white p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Rocket size={40} className="text-brand-blue" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Service Not Found</h1>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">The solution you are looking for might have been moved or renamed.</p>
          <Button onClick={() => navigate('/')} className="bg-brand-blue hover:bg-brand-blue/80 rounded-full px-8 h-12">
            Return to Headquarters
          </Button>
        </motion.div>
      </div>
    );
  }

  const scrollToContact = () => {
    openConsultation(detail.title);
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-white pt-32 pb-24 relative overflow-hidden">
      {/* Background Decor - Immersive Particles & Grids */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#1E7FD805_1px,transparent_1px),linear-gradient(to_bottom,#1E7FD805_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-[10%] right-[5%] w-[40rem] h-[40rem] bg-brand-blue/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[20%] left-[5%] w-[30rem] h-[30rem] bg-brand-green/5 rounded-full blur-[100px] animate-pulse delay-1000" />
        
        {/* Animated Streaks */}
        <motion.div
          animate={{ x: ['-100%', '200%'], opacity: [0, 0.2, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/3 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-blue/30 to-transparent"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Back Navigation */}
        <div className="max-w-6xl mx-auto mb-16">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
          >
            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-bold">Back to Ecosystem</span>
          </motion.button>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left Column: Hero Content */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Zap size={20} className="text-brand-blue" />
                  </div>
                  <span className="text-brand-blue font-bold tracking-[0.3em] uppercase text-xs">
                    Solution Overview
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-7xl font-bold mb-8 leading-tight tracking-tight">
                  {detail.headline.split(' ').map((word, i) => (
                    <span key={i} className={i > 2 ? 'text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-green' : ''}>
                      {word}{' '}
                    </span>
                  ))}
                </h1>
                
                <p className="text-xl text-slate-400 leading-relaxed mb-12 max-w-2xl">
                  {detail.overview}
                </p>

                <div className="flex flex-wrap gap-4 mb-16">
                  <Button 
                    onClick={scrollToContact}
                    className="bg-blue-green text-white font-bold rounded-full px-10 h-14 text-lg shadow-xl shadow-brand-blue/20 hover:scale-105 transition-all"
                  >
                    {detail.ctaText}
                  </Button>
                  <Button 
                    onClick={() => navigate('/#services')}
                    variant="outline"
                    className="rounded-full px-8 h-14 border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10"
                  >
                    Compare Features
                  </Button>
                </div>
              </motion.div>

              {/* Grid of Key Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/10 backdrop-blur-xl relative group overflow-hidden"
                >
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-blue/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                    <Sparkles size={20} className="text-brand-blue" />
                    Key Deliverables
                  </h2>
                  <ul className="space-y-4">
                    {detail.whatYouGet.map((item, i) => (
                      <li key={i} className="flex gap-3 text-slate-300 text-sm">
                        <CheckCircle2 size={16} className="text-brand-green mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {detail.process && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/10 backdrop-blur-xl relative group overflow-hidden"
                  >
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-green/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                      <Target size={20} className="text-brand-green" />
                      Our Approach
                    </h2>
                    <div className="space-y-6">
                      {detail.process.map((step, i) => (
                        <div key={i} className="flex gap-4 items-start">
                          <div className="w-6 h-6 rounded-full bg-brand-green/10 border border-brand-green/20 flex items-center justify-center text-brand-green font-bold text-[10px] shrink-0">
                            {i + 1}
                          </div>
                          <span className="text-sm text-slate-300 leading-tight">{step}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Right Column: Sidebar Tech & Use Cases */}
            <div className="lg:col-span-5 space-y-8">
              {detail.technologies && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-[2rem] bg-gradient-to-br from-white/10 to-transparent border border-white/10 backdrop-blur-2xl"
                >
                  <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-brand-blue mb-6 flex items-center gap-2">
                    <Cpu size={14} /> Technology Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {detail.technologies.map((tech, i) => (
                      <span key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-300 font-medium hover:bg-white/10 transition-colors">
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {detail.useCases && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="p-8 rounded-[2rem] bg-gradient-to-br from-white/10 to-transparent border border-white/10 backdrop-blur-2xl"
                >
                  <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-brand-green mb-6 flex items-center gap-2">
                    <Target size={14} /> Core Use Cases
                  </h3>
                  <ul className="space-y-4">
                    {detail.useCases.map((useCase, i) => (
                      <li key={i} className="flex items-center gap-4 group">
                        <div className="w-2 h-2 rounded-full bg-brand-green group-hover:scale-150 transition-transform" />
                        <span className="text-sm text-slate-300 font-medium">{useCase}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {detail.benefits && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="p-8 rounded-[2rem] bg-gradient-to-br from-white/10 to-transparent border border-white/10 backdrop-blur-2xl"
                >
                  <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-brand-violet mb-6 flex items-center gap-2">
                    <Shield size={14} /> Strategic Benefits
                  </h3>
                  <ul className="space-y-4">
                    {detail.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-4 group">
                        <div className="w-2 h-2 rounded-full bg-brand-violet group-hover:scale-150 transition-transform" />
                        <span className="text-sm text-slate-300 font-medium">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Final Conversion Boost Section */}
        <motion.section
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-32 pt-24"
        >
          <div className="max-w-5xl mx-auto bg-gradient-to-br from-brand-blue/20 via-white/[0.03] to-brand-green/10 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden group">
            {/* Animated background glow */}
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute -top-24 -right-24 w-96 h-96 bg-brand-blue/20 rounded-full blur-[100px]" 
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 10, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-green/20 rounded-full blur-[100px]" 
            />
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Ready to build the <br />next big thing?</h2>
              <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
                Our experts are ready to turn your complex technological vision into a scalable, high-performance reality.
              </p>

              <div className="flex flex-wrap justify-center gap-6 mb-16">
                <Button onClick={scrollToContact} className="bg-blue-green text-white font-bold rounded-full px-10 h-16 text-lg shadow-2xl shadow-brand-blue/30 hover:scale-105 transition-all">
                  Get Free Consultation
                </Button>
                <Button onClick={scrollToContact} variant="outline" className="rounded-full px-10 h-16 text-lg border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10">
                  Connect on WhatsApp
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-3xl mx-auto pt-12 border-t border-white/10">
                <a href="tel:+254751936947" className="flex items-center justify-center gap-4 text-slate-300 hover:text-brand-green transition-all group">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-brand-green/10 group-hover:border-brand-green/20">
                    <Phone size={24} className="text-brand-green" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Direct Line</p>
                    <p className="font-bold text-xl">+254 751 936 947</p>
                  </div>
                </a>
                <a href="mailto:info@vertextech.com" className="flex items-center justify-center gap-4 text-slate-300 hover:text-brand-blue transition-all group">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-brand-blue/10 group-hover:border-brand-blue/20">
                    <Mail size={24} className="text-brand-blue" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Secure Email</p>
                    <p className="font-bold text-xl">info@vertextech.com</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default ServiceDetail;