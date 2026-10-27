import React, { useEffect, useState, useRef } from 'react';
import { Smartphone, Plus, Pencil, Trash2, Copy, Check, ExternalLink, Globe, Link as LinkIcon, FileText, ScrollText, Search, LoaderCircle, Upload, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

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
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

const emptyForm = {
  name: '',
  slug: '',
  icon_url: '',
  version: '',
  about: '',
  privacy_policy: '',
  terms_of_service: '',
  support_email: '',
  website_url: '',
  is_published: true,
};

type FormState = typeof emptyForm;

const slugify = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const AppPolicies = () => {
  const [apps, setApps] = useState<MobileApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setForm((prev) => ({ ...prev, icon_url: dataUrl }));
    };
    reader.onerror = () => toast.error('Failed to read image file');
    reader.readAsDataURL(file);
    if (e.target) e.target.value = '';
  };

  const clearIcon = () => setForm((prev) => ({ ...prev, icon_url: '' }));

  useEffect(() => { fetchApps(); }, []);

  const fetchApps = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('mobile_apps')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setApps((data as MobileApp[]) || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load mobile apps');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setSlugTouched(false);
  };

  const beginEdit = (app: MobileApp) => {
    setEditingId(app.id);
    setSlugTouched(true);
    setForm({
      name: app.name,
      slug: app.slug,
      icon_url: app.icon_url || '',
      version: app.version || '',
      about: app.about || '',
      privacy_policy: app.privacy_policy || '',
      terms_of_service: app.terms_of_service || '',
      support_email: app.support_email || '',
      website_url: app.website_url || '',
      is_published: app.is_published,
    });
    setShowForm(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setForm((prev) => ({
      ...prev,
      name,
      slug: slugTouched ? prev.slug : slugify(name),
    }));
  };

  const save = async () => {
    if (!form.name.trim()) { toast.error('App name is required'); return; }
    const slug = slugTouched && form.slug.trim() ? form.slug.trim() : slugify(form.name);
    if (!slug) { toast.error('App slug is required'); return; }

    setSaving(true);
    const payload = {
      name: form.name.trim(),
      slug,
      icon_url: form.icon_url.trim() || null,
      version: form.version.trim() || null,
      about: form.about.trim() || null,
      privacy_policy: form.privacy_policy || null,
      terms_of_service: form.terms_of_service || null,
      support_email: form.support_email.trim() || null,
      website_url: form.website_url.trim() || null,
      is_published: form.is_published,
    };
    try {
      if (editingId) {
        const { error } = await supabase.from('mobile_apps').update(payload).eq('id', editingId);
        if (error) throw error;
        toast.success('App policy updated');
      } else {
        const { error } = await supabase.from('mobile_apps').insert(payload);
        if (error) throw error;
        toast.success('App policy created');
      }
      setShowForm(false);
      resetForm();
      fetchApps();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save app policy');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (app: MobileApp) => {
    if (!window.confirm(`Delete "${app.name}" and its legal documents? This cannot be undone.`)) return;
    try {
      const { error } = await supabase.from('mobile_apps').delete().eq('id', app.id);
      if (error) throw error;
      toast.success('App policy deleted');
      fetchApps();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete app policy');
    }
  };

  const shareUrl = (slug: string) =>
    `${window.location.origin}/app-policies?app=${encodeURIComponent(slug)}`;

  const copyLink = (slug: string, type: string) => {
    navigator.clipboard.writeText(shareUrl(slug));
    setCopiedId(slug);
    setCopiedType(type);
    setTimeout(() => { setCopiedId(null); setCopiedType(null); }, 2000);
    toast.success(`${type} link copied to clipboard`);
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const filtered = apps.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Mobile Apps &amp; Legal</h2>
          <p className="text-slate-500 mt-1">Manage app details, privacy policies and terms for the public directory</p>
        </div>
        <Button
          onClick={() => { setShowForm(!showForm); if (!showForm) resetForm(); }}
          className="bg-brand-blue hover:bg-brand-blue/90 text-white"
        >
          {showForm ? <span>Cancel</span> : <><Plus size={18} className="mr-2" />Add App</>}
        </Button>
      </div>

      {showForm && (
        <Card className="border-none shadow-sm">
          <CardContent className="pt-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-700">App Name *</Label>
                <Input value={form.name} onChange={handleNameChange} placeholder="e.g. Vertex Order Manager" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-700">Slug (URL identifier)</Label>
                <div className="flex gap-2">
                  <Input
                    value={form.slug}
                    onChange={(e) => { setForm({ ...form, slug: slugify(e.target.value) }); setSlugTouched(true); }}
                    placeholder="auto-generated"
                  />
                </div>
                <p className="text-xs text-slate-400">Used in the shareable link: /app-policies?app={form.slug || 'slug'}</p>
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-sm font-medium text-slate-700">Icon / Logo</Label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 flex gap-2">
                    <Input value={form.icon_url} onChange={(e) => setForm({ ...form, icon_url: e.target.value })} placeholder="https://.../icon.png" className="flex-1" />
                    <Button type="button" variant="outline" size="icon" onClick={() => fileInputRef.current?.click()} title="Upload from device" className="shrink-0">
                      <Upload size={16} />
                    </Button>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  {form.icon_url && (
                    <div className="relative w-14 h-14 rounded-xl border border-slate-200 overflow-hidden shrink-0 group">
                      <img src={form.icon_url} alt="Icon preview" className="w-full h-full object-cover" />
                      <button onClick={clearIcon} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" title="Remove icon">
                        <X size={16} className="text-white" />
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-400">Paste a URL or upload an image from your device. PNG, JPG, WebP supported.</p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-700">Version</Label>
                <Input value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })} placeholder="e.g. 2.3.1" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-700">Support Email</Label>
                <Input value={form.support_email} onChange={(e) => setForm({ ...form, support_email: e.target.value })} placeholder="support@vertextech.com" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-700">Website URL</Label>
                <Input value={form.website_url} onChange={(e) => setForm({ ...form, website_url: e.target.value })} placeholder="https://..." />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">About (short description)</Label>
              <Textarea value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} rows={2} placeholder="One or two sentences describing the app..." />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-2"><FileText size={15} />Privacy Policy</Label>
                <Textarea value={form.privacy_policy} onChange={(e) => setForm({ ...form, privacy_policy: e.target.value })} rows={9} placeholder="Paste the full privacy policy text here..." />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-2"><ScrollText size={15} />Terms of Service</Label>
                <Textarea value={form.terms_of_service} onChange={(e) => setForm({ ...form, terms_of_service: e.target.value })} rows={9} placeholder="Paste the full terms of service text here..." />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={form.is_published}
                onCheckedChange={(v) => setForm({ ...form, is_published: v })}
                id="published"
              />
              <Label htmlFor="published" className="text-sm text-slate-700">Published (visible in public directory)</Label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => { setShowForm(false); resetForm(); }}>Cancel</Button>
              <Button onClick={save} disabled={saving} className="bg-brand-blue hover:bg-brand-blue/90 text-white">
                {saving ? <LoaderCircle className="w-4 h-4 animate-spin" /> : editingId ? 'Update App' : 'Create App'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search apps..." className="pl-10" />
        </div>
        <span className="text-sm text-slate-400">{filtered.length} app{filtered.length === 1 ? '' : 's'}</span>
      </div>

      {loading ? (
        <Card className="border-none shadow-sm">
          <CardContent className="py-16 flex items-center justify-center">
            <LoaderCircle className="w-8 h-8 animate-spin text-brand-blue" />
          </CardContent>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="border-none shadow-sm">
          <CardContent className="py-16 text-center">
            <Smartphone size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Apps {search ? 'match your search' : 'Yet'}</h3>
            <p className="text-slate-500">Add your first mobile app to start hosting its privacy policy and terms of service.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((app) => (
            <Card key={app.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-brand-blue/10 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                      {app.icon_url ? (
                        <img src={app.icon_url} alt={app.name} className="w-full h-full object-cover" />
                      ) : (
                        <Smartphone size={24} className="text-brand-blue" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-semibold text-slate-900 truncate">{app.name}</h4>
                        {app.version && (
                          <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">v{app.version}</span>
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          app.is_published ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {app.is_published ? 'Published' : 'Hidden'}
                        </span>
                      </div>
                      {app.about && <p className="text-sm text-slate-500 mt-1 line-clamp-2">{app.about}</p>}
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><Globe size={12} /> /app-policies?app={app.slug}</span>
                        <span>Updated {formatDate(app.updated_at)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => copyLink(app.slug, 'Privacy')} title="Copy privacy policy link">
                      {copiedId === app.slug && copiedType === 'Privacy' ? <Check size={16} className="text-green-500" /> : <FileText size={16} />}
                      <span className="ml-1.5">Privacy</span>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => copyLink(app.slug, 'Terms')} title="Copy terms of service link">
                      {copiedId === app.slug && copiedType === 'Terms' ? <Check size={16} className="text-green-500" /> : <ScrollText size={16} />}
                      <span className="ml-1.5">Terms</span>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => window.open(shareUrl(app.slug), '_blank')} className="text-slate-500 hover:text-brand-blue" title="Open public page">
                      <ExternalLink size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => beginEdit(app)} className="text-slate-500 hover:text-brand-blue" title="Edit">
                      <Pencil size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => remove(app)} className="text-slate-500 hover:text-red-500" title="Delete">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppPolicies;