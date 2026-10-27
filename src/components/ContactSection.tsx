import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, Send, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from 'sonner';
import { supabase } from '../integrations/supabase/client';

const services = [
  "Mobile App Development",
  "Customized Web Development",
  "Search Engine Optimization",
  "Cyber Security Services",
  "AI Application Services",
  "Cloud & DevOps Services",
  "Automation & AI Integration",
  "SaaS Development"
];

const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service_interest: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('leads')
        .insert([formData]);

      if (error) {
        toast.error(`Could not send message: ${error.message}`);
        console.error('Supabase error:', error);
      } else {
        toast.success("Message sent! We'll get back to you shortly.");
        setFormData({
          name: '',
          email: '',
          service_interest: '',
          message: ''
        });
      }
    } catch (err) {
      toast.error("An unexpected error occurred. Please try again.");
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, service_interest: value }));
  };

  return (
    <section id="contact" className="py-24 bg-brand-off-white relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-green/5 rounded-full blur-[100px] -z-10"></div>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-brand-blue font-bold tracking-[0.2em] uppercase text-sm">Contact Us</span>
            <h2 className="text-5xl md:text-6xl text-brand-navy mt-4 mb-8">Let's build the <br /><span className="text-gradient">future</span> together.</h2>
            
            <p className="text-brand-slate text-xl mb-12 max-w-md">
              Ready to transform your business with cutting-edge technology? Get in touch today for a free consultation.
            </p>

            <div className="space-y-6">
              <a href="tel:+254751936947" className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-brand-blue group-hover:bg-blue-green group-hover:text-white transition-all">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-brand-slate text-sm font-bold uppercase tracking-wider">Call Us</p>
                  <p className="text-brand-navy text-xl font-bold">+254 751 936 947</p>
                </div>
              </a>

              <a href="mailto:oscarodero@tech-center.com" className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-brand-blue group-hover:bg-blue-green group-hover:text-white transition-all">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-brand-slate text-sm font-bold uppercase tracking-wider">Email Us</p>
                  <p className="text-brand-navy text-xl font-bold">oscarodero@tech-center.com</p>
                </div>
              </a>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-brand-blue/5 border border-brand-navy/5"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-brand-navy ml-1">Full Name</label>
                  <Input 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe" 
                    className="h-12 bg-brand-off-white border-none rounded-xl" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-brand-navy ml-1">Email Address</label>
                  <Input 
                    name="email"
                    type="email" 
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com" 
                    className="h-12 bg-brand-off-white border-none rounded-xl" 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-brand-navy ml-1">Service Interest</label>
                <Select value={formData.service_interest} onValueChange={handleSelectChange} required>
                  <SelectTrigger className="h-12 bg-brand-off-white border-none rounded-xl focus:ring-brand-blue">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-brand-navy/5">
                    {services.map((service) => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-brand-navy ml-1">Your Message</label>
                <Textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help you?" 
                  className="min-h-[150px] bg-brand-off-white border-none rounded-2xl resize-none"
                  required 
                />
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-14 bg-blue-green hover:opacity-90 text-white font-bold text-lg rounded-xl shadow-lg shadow-brand-blue/20"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" size={20} />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="ml-2" size={20} />
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;