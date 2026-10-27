import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import * as Sonner from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Twitter, 
  Linkedin, 
  Github, 
  Instagram, 
  Facebook,
  Save,
  Globe,
  ShieldAlert,
  FileText
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const Settings = () => {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [pages, setPages] = useState<any[]>([]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data: settingsData } = await supabase.from('site_settings').select('*');
      const { data: pagesData } = await supabase.from('pages').select('*');
      
      setSettings(settingsData || []);
      setPages(pagesData || []);
      
      const mapped: Record<string, string> = {};
      settingsData?.forEach(s => {
        mapped[s.key] = s.value || '';
      });
      setFormData(mapped);
    } catch (error) {
      Sonner.toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (key: string) => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({ value: formData[key] })
        .eq('key', key);

      if (error) throw error;
      Sonner.toast.success('Setting updated');
    } catch (error) {
      Sonner.toast.error('Save failed');
    }
  };

  const handleSaveAll = async () => {
    try {
      const updates = Object.entries(formData).map(([key, value]) => (
        supabase.from('site_settings').update({ value }).eq('key', key)
      ));
      
      await Promise.all(updates);
      Sonner.toast.success('All settings saved');
    } catch (error) {
      Sonner.toast.error('Batch update failed');
    }
  };

  const updatePage = async (slug: string, content: string) => {
    try {
      const { error } = await supabase.from('pages').update({ content }).eq('slug', slug);
      if (error) throw error;
      Sonner.toast.success('Page updated');
    } catch (error) {
      Sonner.toast.error('Failed to update page');
    }
  };

  if (loading) return <div className="p-20 text-center">Loading settings...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-heading">Settings & CMS</h2>
          <p className="text-sm text-slate-500">Manage site configuration and legal content</p>
        </div>
        <Button onClick={handleSaveAll} className="gap-2 bg-brand-blue hover:bg-brand-blue/90">
          <Save size={18} /> Save All Changes
        </Button>
      </div>

      <Tabs defaultValue="company" className="w-full">
        <TabsList className="bg-slate-100 p-1 rounded-xl mb-6">
          <TabsTrigger value="company" className="rounded-lg px-6">Company Info</TabsTrigger>
          <TabsTrigger value="socials" className="rounded-lg px-6">Social Media</TabsTrigger>
          <TabsTrigger value="legal" className="rounded-lg px-6">Legal Pages</TabsTrigger>
          <TabsTrigger value="seo" className="rounded-lg px-6">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Contact Details</CardTitle>
              <CardDescription>Primary information displayed in header/footer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Building2 size={16} className="text-slate-400"/> Company Name</Label>
                  <Input 
                    value={formData['company_name']} 
                    onChange={e => setFormData({...formData, company_name: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Mail size={16} className="text-slate-400"/> Primary Email</Label>
                  <Input 
                    value={formData['contact_email']} 
                    onChange={e => setFormData({...formData, contact_email: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Phone size={16} className="text-slate-400"/> Phone Number</Label>
                  <Input 
                    value={formData['contact_phone']} 
                    onChange={e => setFormData({...formData, contact_phone: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><MapPin size={16} className="text-slate-400"/> Business Address</Label>
                  <Input 
                    value={formData['contact_address']} 
                    onChange={e => setFormData({...formData, contact_address: e.target.value})} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">About Content</CardTitle>
              <CardDescription>Main copy for the About/Vertex section</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>About Heading</Label>
                <Input 
                  value={formData['about_heading']} 
                  onChange={e => setFormData({...formData, about_heading: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label>About Description</Label>
                <Textarea 
                  value={formData['about_description']} 
                  onChange={e => setFormData({...formData, about_description: e.target.value})}
                  className="min-h-[120px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="socials" className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Social Profiles</CardTitle>
              <CardDescription>Links to your professional social media accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Linkedin size={16} className="text-[#0077b5]"/> LinkedIn URL</Label>
                  <Input 
                    value={formData['social_linkedin']} 
                    onChange={e => setFormData({...formData, social_linkedin: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Twitter size={16} className="text-[#1DA1F2]"/> Twitter / X URL</Label>
                  <Input 
                    value={formData['social_twitter']} 
                    onChange={e => setFormData({...formData, social_twitter: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Github size={16} className="text-slate-900"/> GitHub URL</Label>
                  <Input 
                    value={formData['social_github']} 
                    onChange={e => setFormData({...formData, social_github: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Instagram size={16} className="text-[#E4405F]"/> Instagram URL</Label>
                  <Input 
                    value={formData['social_instagram']} 
                    onChange={e => setFormData({...formData, social_instagram: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Facebook size={16} className="text-[#1877F2]"/> Facebook URL</Label>
                  <Input 
                    value={formData['social_facebook']} 
                    onChange={e => setFormData({...formData, social_facebook: e.target.value})} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="legal" className="space-y-6">
          {pages.map(page => (
            <Card key={page.id} className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{page.title}</CardTitle>
                  <CardDescription>Slug: /{page.slug}</CardDescription>
                </div>
                <Button size="sm" variant="outline" onClick={() => updatePage(page.slug, page.content)}>
                  Save {page.title}
                </Button>
              </CardHeader>
              <CardContent>
                <Textarea 
                  value={page.content || ''} 
                  onChange={e => setPages(pages.map(p => p.id === page.id ? {...p, content: e.target.value} : p))}
                  className="min-h-[250px] font-mono text-xs"
                />
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Global SEO</CardTitle>
              <CardDescription>Default meta tags for search engine visibility</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Default Page Title</Label>
                <Input 
                  value={formData['seo_title']} 
                  onChange={e => setFormData({...formData, seo_title: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Textarea 
                  value={formData['seo_description']} 
                  onChange={e => setFormData({...formData, seo_description: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-amber-50 border-amber-100">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-amber-800">
                <ShieldAlert size={20} /> Access Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label className="text-amber-800">Admin Dashboard PIN</Label>
                <Input 
                  type="password"
                  value={formData['admin_pin']} 
                  onChange={e => setFormData({...formData, admin_pin: e.target.value})} 
                  className="bg-white"
                />
                <p className="text-xs text-amber-600 italic">This PIN is used to enter the hidden admin area from the logo taps.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
