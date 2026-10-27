import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Smartphone, ArrowLeft, ChevronRight, FileText, ScrollText, Mail, Globe, CalendarDays, Copy, Check, ShieldCheck, LoaderCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface MobileApp {
  id: string;
  name: string;
  slug: string;
  icon_url: string | null;
  version: string | null;
  about: string | null;
  privacy_policy: string | null;
  terms_of_service: string | null;
  support_email: string | null;
  website_url: string | null;
  created_at: string;
  updated_at: string;
}

type Tab = 'privacy' | 'terms';

const NL = String.fromCharCode(10);
const DBL_NL = NL + NL;

const TextContent = ({ children }: { children: string }) => {
  const paragraphs = children.split(DBL_NL).filter((p: string) => p.trim());

  const renderParagraph = (text: string, idx: number) => {
    const trimmed = text.trim();
    if (!trimmed) return null;

    const isSectionHeader =
      (trimmed.length < 80 && trimmed === trimmed.toUpperCase() && /^[A-Z a-z 0-9]{2,}$/.test(trimmed)) ||
      /^[A-Z][A-Za-z ]+:$/.test(trimmed);

    if (isSectionHeader) {
      return (
        <h3 key={idx} className="text-lg font-bold text-slate-900 dark:text-white mt-10 mb-4 font-heading tracking-tight">
          {trimmed.replace(/:\s*$/, '')}
        </h3>
      );
    }

    const lines = trimmed.split(NL);
    const hasBullet = lines.some((l: string) => /^[-*]\s/.test(l.trim()));
    const hasNumbered = lines.some((l: string) => /^\d+[.)]\s/.test(l.trim()));

    if (lines.length > 1 && (hasBullet || hasNumbered)) {
      return (
        <div key={idx} className="space-y-3 my-6">
          {lines.map((line: string, li: number) => {
            const bulletMatch = /^[-*]\s(.+)/.exec(line.trim());
            const numMatch = /^(\d+)[.)]\s(.+)/.exec(line.trim());
            if (bulletMatch) {
              return (
                <div key={li} className="flex items-start gap-3 text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="w-2 h-2 rounded-full bg-brand-blue mt-2.5 shrink-0" />
                  <span>{bulletMatch[1]}</span>
                </div>
              );
            }
            if (numMatch) {
              return (
                <div key={li} className="flex items-start gap-3 text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="text-sm font-semibold text-brand-blue mt-0.5 shrink-0 w-6">{numMatch[1]}.</span>
                  <span>{numMatch[2]}</span>
                </div>
              );
            }
            return <p key={li} className="text-slate-700 dark:text-slate-300 leading-relaxed">{line}</p>;
          })}
        </div>
      );
    }

    return (
      <p key={idx} className="text-slate-700 dark:text-slate-300 leading-relaxed text-base md:text-[15px] mb-5 last:mb-0">
        {trimmed}
      </p>
    );
  };

  return (
    <div className="space-y-1">
      {paragraphs.map((para: string, i: number) => renderParagraph(para, i))}
    </div>
  );
};

const AppPrivacyViewer = () => {
  const [searchParams] = useSearchParams();
  const appParam = searchParams.get('app');
  const [apps, setApps] = useState<MobileApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<MobileApp | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [tab, setTab] = useState<Tab>('privacy');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('mobile_apps')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false });
        if (error) throw error;
        const list = (data as MobileApp[]) || [];
        setApps(list);
        if (appParam) {
          const match = list.find((a) => a.slug === appParam);
          if (match) setSelected(match);
          else setNotFound(true);
        }
      } catch (error: any) {
        toast.error(error.message || 'Failed to load app policies');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [appParam]);

  const copyCurrent = () => {
    const url = `${window.location.origin}/app-policies${appParam ? `?app=${appParam}` : ''}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Policy link copied to clipboard');
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const currentDoc = selected ? (tab === 'privacy' ? selected.privacy_policy : selected.terms_of_service) : '';

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-[100dvh]">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-blue transition-colors">
            <ArrowLeft size={16} />
            Back to Vertex Tech Solutions
          </Link>
          <div className="flex items-center gap-2 text-sm font-bold text-brand-navy dark:text-white font-heading">
            <div className="w-7 h-7 bg-gradient-to-br from-brand-blue to-brand-green rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-black">V</span>
            </div>
            <span className="hidden sm:inline">VERTEX TECH SOLUTIONS</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-6xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <LoaderCircle className="w-10 h-10 animate-spin text-brand-blue mb-4" />
            <p className="text-slate-500">Loading app legal documents...</p>
          </div>
        ) : appParam && notFound ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
              <ShieldCheck size={32} className="text-slate-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">App Not Found</h1>
            <p className="text-slate-500 mb-8">We could not find a published policy for &quot;{appParam}&quot;.</p>
            <ViewDirectory apps={apps} onSelect={(a) => { setSelected(a); setNotFound(false); }} />
          </div>
        ) : appParam && selected ? (
          <div className="animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              <div className="md:col-span-2 lg:col-span-2">
                <nav className="flex items-center gap-1.5 text-sm text-slate-400 mb-6 flex-wrap">
                  <Link to="/app-policies" className="hover:text-brand-blue transition-colors">App Policies</Link>
                  <ChevronRight size={14} />
                  <span className="text-slate-600 dark:text-slate-300 font-medium">{selected.name}</span>
                </nav>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-8 sticky top-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-brand-blue/10 flex items-center justify-center overflow-hidden shrink-0">
                      {selected.icon_url ? (
                        <img src={selected.icon_url} alt={selected.name} className="w-full h-full object-cover" />
                      ) : (
                        <Smartphone size={28} className="text-brand-blue" />
                      )}
                    </div>
                    <div>
                      <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white font-heading">{selected.name}</h1>
                      {selected.version && (
                        <span className="inline-flex items-center gap-1 mt-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs px-2.5 py-0.5 rounded-full">
                          Version {selected.version}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-6">
                    <button
                      onClick={() => setTab('privacy')}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all',
                        tab === 'privacy'
                          ? 'bg-white dark:bg-slate-900 text-brand-blue shadow-sm'
                          : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
                      )}
                    >
                      <FileText size={16} /> Privacy Policy
                    </button>
                    <button
                      onClick={() => setTab('terms')}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all',
                        tab === 'terms'
                          ? 'bg-white dark:bg-slate-900 text-brand-blue shadow-sm'
                          : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
                      )}
                    >
                      <ScrollText size={16} /> Terms of Service
                    </button>
                  </div>

                  <dl className="space-y-4 text-sm">
                    {selected.about && (
                      <div>
                        <dt className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">About</dt>
                        <dd className="text-slate-600 dark:text-slate-300 leading-relaxed">{selected.about}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Last Updated</dt>
                      <dd className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <CalendarDays size={14} className="text-slate-400" />
                        {formatDate(selected.updated_at)}
                      </dd>
                    </div>
                    {selected.support_email && (
                      <div>
                        <dt className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Support</dt>
                        <dd>
                          <a href={`mailto:${selected.support_email}`} className="flex items-center gap-2 text-brand-blue hover:underline">
                            <Mail size={14} /> {selected.support_email}
                          </a>
                        </dd>
                      </div>
                    )}
                    {selected.website_url && (
                      <div>
                        <dt className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Website</dt>
                        <dd>
                          <a href={selected.website_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-brand-blue hover:underline">
                            <Globe size={14} /> {selected.website_url.replace(/^https?:\/\//, '')}
                          </a>
                        </dd>
                      </div>
                    )}
                  </dl>

                  <button
                    onClick={copyCurrent}
                    className="mt-6 w-full flex items-center justify-center gap-2 bg-brand-blue hover:bg-brand-blue/90 text-white font-medium px-4 py-2.5 rounded-xl text-sm transition-all active:scale-[0.98]"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Link Copied' : 'Copy Policy Link'}
                  </button>
                </div>
              </div>

              <div className="md:col-span-3">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-8 md:p-10">
                  <div className="border-b border-slate-200 dark:border-slate-800 pb-6 mb-6">
                    <p className="text-xs font-semibold text-brand-blue uppercase tracking-[0.15em] mb-2">
                      {selected.name}
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white font-heading tracking-tight">
                      {tab === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
                    </h2>
                    <p className="text-sm text-slate-400 mt-2">
                      Effective date: {formatDate(selected.updated_at)}
                    </p>
                  </div>

                  {currentDoc ? (
                    <TextContent>{currentDoc}</TextContent>
                  ) : (
                    <p className="text-slate-400 text-sm italic">
                      This document has not been published yet by the app provider.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <ViewDirectory apps={apps} onSelect={(a) => { setSelected(a); setNotFound(false); }} />
        )}
      </div>
    </div>
  );
};

const ViewDirectory = ({ apps, onSelect }: { apps: MobileApp[]; onSelect: (app: MobileApp) => void }) => (
  <div className="animate-in fade-in duration-500">
    <div className="max-w-2xl mb-10">
      <div className="flex items-center gap-2 text-xs font-semibold text-brand-blue uppercase tracking-[0.15em] mb-3">
        <ShieldCheck size={14} /> Legal Center
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white font-heading tracking-tight mb-3">
        App Privacy Policies
      </h1>
      <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
        Browse privacy policies and terms of service for mobile applications built by Vertex Tech Solutions.
        Select an app to view or copy its shareable policy links for app store compliance.
      </p>
    </div>

    {apps.length === 0 ? (
      <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
        <Smartphone size={40} className="mx-auto text-slate-300 mb-4" />
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">No Apps Listed Yet</h2>
        <p className="text-slate-500 mt-1">Published app policies will appear here.</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {apps.map((app) => (
          <button
            key={app.id}
            onClick={() => onSelect(app)}
            className="text-left bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-brand-blue/40 hover:-translate-y-0.5 transition-all p-6 group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-brand-blue/10 flex items-center justify-center overflow-hidden shrink-0">
                {app.icon_url ? (
                  <img src={app.icon_url} alt={app.name} className="w-full h-full object-cover" />
                ) : (
                  <Smartphone size={22} className="text-brand-blue" />
                )}
              </div>
              <ChevronRight size={16} className="text-slate-300 group-hover:text-brand-blue group-hover:translate-x-0.5 transition-all ml-auto" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-brand-blue transition-colors">
              {app.name}
            </h3>
            {app.about && <p className="text-sm text-slate-500 mt-1 line-clamp-2 leading-relaxed">{app.about}</p>}
            {app.version && <span className="text-xs text-slate-400 mt-2 inline-block">v{app.version}</span>}
          </button>
        ))}
      </div>
    )}
  </div>
);

export default AppPrivacyViewer;