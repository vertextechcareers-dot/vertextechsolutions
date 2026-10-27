import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Phone, Mail, Menu, X, Download } from 'lucide-react';
import { Button } from './ui/button';
import AdminPinModal from './AdminPinModal';
import { useConsultation } from './ConsultationProvider';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { openConsultation } = useConsultation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Services', href: '/#services' },
    { name: 'Why Vertex', href: '/#why-vertex' },
    { name: 'About', href: '/#about' },
    { name: 'Contact', href: null, action: () => openConsultation() },
  ];

  const handleLogoClick = (e: React.MouseEvent) => {
    // If it's a mobile device or just a regular click, we want to track it
    // But Link already handles navigation, so we use e.preventDefault() only if we want to block it
    // However, the user said "tapping on the logo 6 times", which usually means they don't want to navigate every time.
    // Let's make it so it tracks taps but doesn't necessarily block the first tap if they are just navigating home.
    // Actually, to count "6 taps" effectively without navigating away every time, we should probably prevent default if tapCount > 0.
    
    setTapCount((prev) => prev + 1);
    
    if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);
    
    tapTimeoutRef.current = setTimeout(() => {
      setTapCount(0);
    }, 2000);

    if (tapCount + 1 >= 6) {
      e.preventDefault();
      setIsAdminModalOpen(true);
      setTapCount(0);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Utility Bar */}
      <div className={`bg-brand-navy text-white py-2 px-4 transition-all duration-300 ${isScrolled ? 'h-0 py-0 opacity-0 overflow-hidden' : 'opacity-100'}`}>
        <div className="container mx-auto flex justify-end items-center gap-6 text-sm font-medium">
          <a href="tel:+254751936947" className="flex items-center gap-2 hover:text-brand-green transition-colors">
            <Phone size={14} className="text-brand-green" />
            <span>+254 751 936 947</span>
          </a>
          <a href="mailto:info@vertextech.com" className="flex items-center gap-2 hover:text-brand-green transition-colors">
            <Mail size={14} className="text-brand-green" />
            <span>info@vertextech.com</span>
          </a>
        </div>
      </div>

      <nav className={`transition-all duration-300 ${isScrolled ? 'glass py-3 shadow-lg' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" onClick={handleLogoClick}>
            <img 
              src="https://storage.googleapis.com/dala-prod-public-storage/attachments/6259a284-a47b-4198-87ad-87fd35d4d74e/1783597068772_Social_DP.png" 
              alt="Vertex Logo" 
              className="h-10 w-auto transform transition-transform group-hover:scale-110"
            />
            <div className="flex flex-col leading-none">
              <span className="text-brand-navy dark:text-white font-black text-xl tracking-tight">VERTEX</span>
              <span className="text-brand-green font-medium text-[10px] tracking-[0.2em]">TECH SOLUTIONS</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) =>
              link.action ? (
                <button
                  key={link.name}
                  onClick={link.action}
                  className="text-brand-navy dark:text-white font-semibold text-sm hover:text-brand-blue transition-colors"
                >
                  {link.name}
                </button>
              ) : (
                <Link
                  key={link.name}
                  to={link.href!}
                  className="text-brand-navy dark:text-white font-semibold text-sm hover:text-brand-blue transition-colors"
                >
                  {link.name}
                </Link>
              )
            )}
            <Button 
              onClick={() => openConsultation()}
              className="bg-blue-green hover:opacity-90 text-white font-bold border-none rounded-full px-6 py-5 shadow-lg shadow-brand-blue/20"
            >
              Get a Free Consultation
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/downloads')}
              className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white font-bold rounded-full px-5 py-5 transition-colors"
            >
              <Download size={18} className="mr-2" />
              Downloads
            </Button>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden text-brand-navy dark:text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass absolute top-full left-0 right-0 p-6 flex flex-col gap-6 animate-in slide-in-from-top duration-300">
            {navLinks.map((link) =>
              link.action ? (
                <button
                  key={link.name}
                  onClick={() => { link.action!(); setMobileMenuOpen(false); }}
                  className="text-brand-navy dark:text-white font-bold text-lg border-b border-brand-navy/10 pb-2 text-left"
                >
                  {link.name}
                </button>
              ) : (
                <Link
                  key={link.name}
                  to={link.href!}
                  className="text-brand-navy dark:text-white font-bold text-lg border-b border-brand-navy/10 pb-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              )
            )}
            <Button 
              onClick={() => { openConsultation(); setMobileMenuOpen(false); }}
              className="bg-blue-green text-white font-bold rounded-xl py-6"
            >
              Get a Free Consultation
            </Button>
            <Button
              variant="outline"
              onClick={() => { navigate('/downloads'); setMobileMenuOpen(false); }}
              className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white font-bold rounded-xl py-6"
            >
              <Download size={18} className="mr-2" />
              Downloads
            </Button>
          </div>
        )}
      </nav>
      <AdminPinModal isOpen={isAdminModalOpen} onClose={() => setIsAdminModalOpen(false)} />
    </header>
  );
};

export default Navbar;