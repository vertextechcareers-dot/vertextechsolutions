import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import * as Sonner from 'sonner';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Mail, 
  Phone, 
  Building2, 
  Trash2, 
  Edit,
  ExternalLink
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const Clients = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: ''
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*, projects(id, title)')
        .order('name');

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      Sonner.toast.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (client?: any) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        name: client.name,
        email: client.email,
        phone: client.phone || '',
        company: client.company || '',
        notes: client.notes || ''
      });
    } else {
      setEditingClient(null);
      setFormData({ name: '', email: '', phone: '', company: '', notes: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingClient) {
        const { error } = await supabase
          .from('clients')
          .update(formData)
          .eq('id', editingClient.id);
        if (error) throw error;
        Sonner.toast.success('Client updated');
      } else {
        const { error } = await supabase
          .from('clients')
          .insert([formData]);
        if (error) throw error;
        Sonner.toast.success('Client added');
      }
      setIsModalOpen(false);
      fetchClients();
    } catch (error) {
      Sonner.toast.error('Operation failed');
    }
  };

  const deleteClient = async (id: string) => {
    if (!confirm('Delete this client? All related projects will be unlinked.')) return;
    try {
      const { error } = await supabase.from('clients').delete().eq('id', id);
      if (error) throw error;
      Sonner.toast.success('Client deleted');
      fetchClients();
    } catch (error) {
      Sonner.toast.error('Failed to delete');
    }
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <h2 className="text-2xl font-bold text-slate-900 font-heading">Clients</h2>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              placeholder="Search clients..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => handleOpenModal()} className="gap-2 bg-brand-blue hover:bg-brand-blue/90">
            <Plus size={18} /> Add Client
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Client Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Active Projects</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">Loading...</TableCell>
              </TableRow>
            ) : filteredClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">No clients found</TableCell>
              </TableRow>
            ) : (
              filteredClients.map((client) => (
                <TableRow key={client.id} className="hover:bg-slate-50">
                  <TableCell>
                    <div className="font-medium text-slate-900">{client.name}</div>
                    <div className="text-xs text-slate-400">{client.id.substring(0, 8)}...</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-sm text-slate-600">
                      <div className="flex items-center gap-2"><Mail size={14} className="text-slate-400"/> {client.email}</div>
                      {client.phone && <div className="flex items-center gap-2"><Phone size={14} className="text-slate-400"/> {client.phone}</div>}
                    </div>
                  </TableCell>
                  <TableCell>
                    {client.company ? (
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <Building2 size={16} className="text-slate-400" /> {client.company}
                      </div>
                    ) : <span className="text-slate-400 text-xs italic">Not specified</span>}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {client.projects?.length > 0 ? (
                        client.projects.map((p: any) => (
                          <Badge key={p.id} variant="secondary" className="bg-brand-blue/5 text-brand-blue border-none">
                            {p.title}
                          </Badge>
                        ))
                      ) : <span className="text-slate-400 text-xs">No projects</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-slate-400">
                          <MoreVertical size={18} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenModal(client)} className="gap-2">
                          <Edit size={16} /> Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-red-600" onClick={() => deleteClient(client.id)}>
                          <Trash2 size={16} /> Delete Client
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingClient ? 'Edit Client' : 'Add New Client'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" type="email" required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input 
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input 
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit">Save Client</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

import { Badge } from '@/components/ui/badge';

export default Clients;
