import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, LogIn, Shield, LoaderCircle, TriangleAlert } from 'lucide-react';
import Sidebar from '@/components/admin/Sidebar';
import Overview from '@/components/admin/Overview';
import Leads from '@/components/admin/Leads';
import Clients from '@/components/admin/Clients';
import Projects from '@/components/admin/Projects';
import Services from '@/components/admin/Services';
import Messages from '@/components/admin/Messages';
import Analytics from '@/components/admin/Analytics';
import Settings from '@/components/admin/Settings';
import SecuredFiles from '@/components/admin/SecuredFiles';
import AppPolicies from '@/components/admin/AppPolicies';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [activeSection, setActiveSection] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthChecking(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthChecking(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setLoginError('Please enter email and password');
      return;
    }
    setSigningIn(true);
    setLoginError('');
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        setLoginError(error.message);
        toast.error(error.message);
      } else {
        toast.success('Welcome back, Admin');
      }
    } catch (err: any) {
      const msg = err?.message || 'Authentication failed';
      setLoginError(msg);
      toast.error(msg);
    } finally {
      setSigningIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Signed out');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to sign out');
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview': return <Overview />;
      case 'leads': return <Leads />;
      case 'clients': return <Clients />;
      case 'projects': return <Projects />;
      case 'services': return <Services />;
      case 'secured-files': return <SecuredFiles />;
      case 'app-policies': return <AppPolicies />;
      case 'messages': return <Messages />;
      case 'analytics': return <Analytics />;
      case 'settings': return <Settings />;
      default: return <Overview />;
    }
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoaderCircle className="w-8 h-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border-0 shadow-2xl bg-white dark:bg-slate-900 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-brand-blue to-brand-green" />
            <CardHeader className="pb-4 text-center pt-8">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-blue to-brand-green rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-blue/20">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-heading font-bold text-brand-navy dark:text-white">
                Admin Access
              </CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400">
                Sign in to manage Vertex Tech Solutions
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-8 px-8">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input
                      type="email"
                      placeholder="admin@vertex-tech.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setLoginError(''); }}
                      className="pl-10 h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-blue/20 transition-all"
                      disabled={signingIn}
                      autoFocus
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setLoginError(''); }}
                      className="pl-10 pr-10 h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-blue/20 transition-all"
                      disabled={signingIn}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {loginError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex items-center gap-2 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg"
                  >
                    <TriangleAlert size={16} className="shrink-0" />
                    <span>{loginError}</span>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-brand-blue to-brand-green hover:from-brand-blue/90 hover:to-brand-green/90 text-white font-medium shadow-lg shadow-brand-blue/20 transition-all active:scale-[0.98]"
                  disabled={signingIn}
                >
                  {signingIn ? (
                    <span className="flex items-center gap-2">
                      <LoaderCircle className="w-4 h-4 animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <LogIn size={18} />
                      Sign In
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onLogout={handleLogout}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
          <h1 className="text-xl font-bold text-slate-800 capitalize font-heading">
            {activeSection.replace('-', ' ')}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400 hidden md:block">
              {session?.user?.email}
            </span>
            <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold text-xs">
              {session?.user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;