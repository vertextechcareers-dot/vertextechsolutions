import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import * as Sonner from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Layout, 
  MoveUp, 
  MoveDown, 
  Image as ImageIcon 
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const Services = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    slug: '',
    is_active: true,
    display_order: 0,
    color: 'blue'
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      Sonner.toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (service?: any) => {
    if (service) {
      setEditingService(service);
      setFormData({
        title: service.title,
        description: service.description,
        slug: service.slug,
        is_active: service.is_active ?? true,
        display_order: service.display_order ?? 0,
        color: service.color || 'blue'
      });
    } else {
      setEditingService(null);
      setFormData({
        title: '',
        description: '',
        slug: '',
        is_active: true,
        display_order: services.length,
        color: 'blue'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.slug) {
        formData.slug = formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');
      }

      if (editingService) {
        const { error } = await supabase.from('services').update(formData).eq('id', editingService.id);
        if (error) throw error;
        Sonner.toast.success('Service updated');
      } else {
        const { error } = await supabase.from('services').insert([formData]);
        if (error) throw error;
        Sonner.toast.success('Service added');
      }
      setIsModalOpen(false);
      fetchServices();
    } catch (error) {
      Sonner.toast.error('Failed to save service');
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    try {
      const { error } = await supabase.from('services').update({ is_active: !current }).eq('id', id);
      if (error) throw error;
      fetchServices();
    } catch (error) {
      Sonner.toast.error('Toggle failed');
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm('Delete this service? This will affect the main website.')) return;
    try {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
      Sonner.toast.success('Service deleted');
      fetchServices();
    } catch (error) {
      Sonner.toast.error('Delete failed');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-heading">Services CMS</h2>
          <p className="text-sm text-slate-500">Manage what appears on the services section</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2 bg-brand-blue hover:bg-brand-blue/90">
          <Plus size={18} /> Add Service
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-20 text-slate-400 italic">Loading services...</div>
        ) : services.length === 0 ? (
          <div className="col-span-full text-center py-20 text-slate-400 italic">No services found</div>
        ) : (
          services.map((service) => (
            <Card key={service.id} className={cn(
              "border-none shadow-sm group overflow-hidden transition-all",
              !service.is_active && "opacity-60"
            )}>
              <div className={cn("h-2 w-full", 
                service.color === 'blue' ? 'bg-brand-blue' : 
                service.color === 'green' ? 'bg-brand-green' : 
                'bg-brand-violet'
              )} />
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-slate-900 line-clamp-1">{service.title}</h3>
                  <button 
                    onClick={() => toggleActive(service.id, service.is_active)}
                    className={cn(
                      "transition-colors",
                      service.is_active ? "text-green-500" : "text-slate-300"
                    )}
                  >
                    {service.is_active ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                  </button>
                </div>
                <p className="text-sm text-slate-500 line-clamp-3 mb-6 min-h-[60px]">
                  {service.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenModal(service)}>
                      <Edit size={16} className="text-slate-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteService(service.id)}>
                      <Trash2 size={16} className="text-red-400" />
                    </Button>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Order: {service.display_order}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="s-title">Title</Label>
                <Input 
                  id="s-title" required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="s-slug">Slug (URL)</Label>
                <Input 
                  id="s-slug"
                  placeholder="auto-generated if empty"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="s-desc">Description</Label>
              <Textarea 
                id="s-desc" required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Color Theme</Label>
                <Select 
                  value={formData.color} 
                  onValueChange={(v) => setFormData({...formData, color: v})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="violet">Violet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="s-order">Display Order</Label>
                <Input 
                  id="s-order" type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value)})}
                />
              </div>
              <div className="flex items-center space-x-2 pt-8">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, is_active: !formData.is_active})}
                  className={cn(
                    "w-4 h-4 rounded border transition-colors flex items-center justify-center",
                    formData.is_active ? "bg-brand-blue border-brand-blue text-white" : "border-slate-300"
                  )}
                >
                  {formData.is_active && <CheckCircle2 size={12} />}
                </button>
                <Label className="text-sm font-normal">Active on website</Label>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit">Save Service</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Services;
