import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import { useConsultation } from './ConsultationProvider';

const Hero = () => {
  const { openConsultation } = useConsultation();
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-brand-navy">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-brand-blue/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-brand-green/20 rounded-full blur-[120px] animate-pulse delay-700"></div>
        
        {/* Abstract Grid/Particle Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#1E7FD8_1px,transparent_1px)] [background-size:40px_40px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-blue font-bold text-xs tracking-widest uppercase mb-6">
              Innovate. Automate. Secure. Grow.
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-[0.9] tracking-tighter">
              All-in-one tech <br />
              <span className="text-gradient">solutions</span> for modern <br />
              businesses.
            </h1>
            <p className="text-brand-slate text-xl md:text-2xl mb-10 max-w-2xl leading-relaxed">
              We empower businesses with cutting-edge mobile apps, custom web solutions, and AI-driven automation to stay ahead in a digital-first world.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button
              onClick={() => openConsultation()}
              className="bg-blue-green hover:scale-105 transition-transform text-white font-bold h-14 px-8 rounded-xl text-lg group w-full sm:w-auto"
            >
              Start Your Project
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Link to="/#services">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 h-14 px-8 rounded-xl text-lg w-full sm:w-auto">
                Explore Services
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Decorative Rotating Element */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 -right-64 hidden lg:block w-[800px] h-[800px] border border-white/5 rounded-full"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-brand-green rounded-full blur-sm"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-brand-blue rounded-full blur-sm"></div>
      </motion.div>
    </section>
  );
};

export default Hero;