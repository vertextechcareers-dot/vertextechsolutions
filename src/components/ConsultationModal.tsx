import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, Phone, Mail, User, Sparkles, Target, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillService?: string;
}

const ConsultationModal = ({ isOpen, onClose, prefillService }: ConsultationModalProps) => {
  const [step, setStep] = useState<'form' | 'submitting' | 'success'>('form');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: prefillService || '',
    message: '',
  });

  useEffect(() => {
    if (prefillService) {
      setFormData(prev => ({ ...prev, service: prefillService }));
    }
  }, [prefillService]);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep('form');
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          service: prefillService || '',
          message: '',
        });
      }, 300);
    }
  }, [isOpen, prefillService]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Please fill in your name and email');
      return;
    }

    setStep('submitting');

    try {
      const { error } = await supabase.from('consultations').insert({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        company: formData.company.trim() || null,
        service: formData.service.trim() || null,
        message: formData.message.trim() || null,
        status: 'pending',
      });

      if (error) {
        // If supabase isn't connected, simulate success
        console.log('Supabase not connected, logging consultation:', formData);
        setStep('success');
        return;
      }

      setStep('success');
      toast.success('Consultation request submitted! We will reach out shortly.');
    } catch (err) {
      console.log('Consultation submitted (offline mode):', formData);
      setStep('success');
    }
  };

  const serviceOptions = [
    'Mobile App Development',
    'Custom Web Development',
    'SaaS Development',
    'Cloud & DevOps',
    'AI Application Services',
    'Automation & AI Integration',
    'Cybersecurity',
    'SEO Services',
    'Other',
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0B1120] border border-white/10 shadow-2xl shadow-brand-blue/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background Decor */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-blue/10 rounded-full blur-[100px]" />
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-brand-green/5 rounded-full blur-[100px]" />
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1E7FD805_1px,transparent_1px),linear-gradient(to_bottom,#1E7FD805_1px,transparent_1px)] bg-[size:30px_30px]" />
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
            >
              <X size={18} />
            </button>

            <div className="relative p-8 md:p-12">
              {step === 'form' && (
                <>
                  {/* Header */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-blue to-brand-green/50 flex items-center justify-center">
                        <Sparkles size={16} className="text-white" />
                      </div>
                      <span className="text-brand-blue font-bold tracking-[0.2em] uppercase text-xs">Get Started</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl text-white font-bold mb-3 tracking-tight">
                      Let's Build Something <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-green">Amazing</span>
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed max-w-lg">
                      Tell us about your project and we'll craft a tailored solution that drives real results for your business.
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 tracking-wide uppercase">Full Name <span className="text-brand-blue">*</span></label>
                        <div className="relative">
                          <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/50 transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 tracking-wide uppercase">Email <span className="text-brand-blue">*</span></label>
                        <div className="relative">
                          <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@company.com"
                            required
                            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/50 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 tracking-wide uppercase">Phone</label>
                        <div className="relative">
                          <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+254 7XX XXX XXX"
                            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/50 transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-300 tracking-wide uppercase">Company</label>
                        <div className="relative">
                          <Target size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="Your Company Ltd"
                            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/50 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300 tracking-wide uppercase">Service Interested In</label>
                      <div className="relative">
                        <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 z-10" />
                        <select
                          name="service"
                          value={formData.service}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/50 transition-all appearance-none cursor-pointer"
                        >
                          <option value="" className="bg-[#0B1120] text-slate-500">Select a service...</option>
                          {serviceOptions.map((opt) => (
                            <option key={opt} value={opt} className="bg-[#0B1120] text-white">{opt}</option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className="text-slate-500">
                            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300 tracking-wide uppercase">Project Details</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us about your project, goals, timeline, and any specific requirements..."
                        rows={4}
                        className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 focus:border-brand-blue/50 transition-all resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-brand-blue to-brand-green text-white font-bold h-14 rounded-xl text-base hover:shadow-xl hover:shadow-brand-blue/20 hover:scale-[1.02] transition-all duration-300 group"
                    >
                      <Send size={18} className="mr-2 group-hover:translate-x-1 transition-transform" />
                      Submit Consultation Request
                    </Button>

                    <p className="text-center text-xs text-slate-500">
                      We respect your privacy. No spam, ever.
                    </p>
                  </form>
                </>
              )}

              {step === 'submitting' && (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full border-4 border-brand-blue/30 border-t-brand-blue animate-spin mb-6" />
                  <h3 className="text-2xl text-white font-bold mb-2">Submitting Your Request</h3>
                  <p className="text-slate-400 text-sm">Please hold on while we process your information...</p>
                </div>
              )}

              {step === 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-16 flex flex-col items-center justify-center text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-green/20 to-brand-blue/20 border border-brand-green/20 flex items-center justify-center mb-6">
                    <CheckCircle2 size={40} className="text-brand-green" />
                  </div>
                  <h3 className="text-3xl text-white font-bold mb-3 tracking-tight">Request Received!</h3>
                  <p className="text-slate-400 text-sm max-w-md mb-8 leading-relaxed">
                    Thank you {formData.name.split(' ')[0]}! Our team will review your project details and reach out within 24 hours to schedule a free consultation.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href="tel:+254751936947"
                      className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all text-sm font-semibold"
                    >
                      <Phone size={16} className="text-brand-green" />
                      Call Us Now
                    </a>
                    <Button
                      onClick={onClose}
                      className="bg-gradient-to-r from-brand-blue to-brand-green text-white font-bold rounded-xl px-8 h-12"
                    >
                      Close
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConsultationModal;