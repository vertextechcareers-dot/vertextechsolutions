import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CoreServices from './components/CoreServices';
import WhyVertex from './components/WhyVertex';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import { Toaster } from './components/ui/sonner';
import ServiceDetail from './components/ServiceDetail';
import FloatingButtons from './components/FloatingButtons';
import AdminDashboard from './pages/AdminDashboard';
import FileDownloads from './components/FileDownloads';
import AppPrivacyViewer from './components/AppPrivacyViewer';
import { ConsultationProvider } from './components/ConsultationProvider';

function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return null;
}

const Home = () => (
  <>
    <Hero />
    <WhyVertex />
    <CoreServices />
    <ContactSection />
  </>
);

function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <ConsultationProvider>
      <div className="min-h-screen selection:bg-brand-blue selection:text-white">
        <ScrollToHash />
        {!isAdmin && <Navbar />}
        <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/downloads" element={<FileDownloads />} />
          <Route path="/app-policies" element={<AppPrivacyViewer />} />
          <Route path="/privacy" element={<AppPrivacyViewer />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <FloatingButtons />}
      <Toaster position="top-center" expand={false} richColors />
    </div>
    </ConsultationProvider>
  );
}

export default App;