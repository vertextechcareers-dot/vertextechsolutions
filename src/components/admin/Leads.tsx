import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import * as Sonner from 'sonner';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  MoreVertical,
  Search,
  Filter,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  UserCheck,
  Plus,
  Pencil,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  service_interest: string | null;
  status: string | null;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
}

const emptyLead = {
  name: '',
  email: '',
  phone: '',
  message: '',
  service_interest: '',
  status: 'new',
  notes: '',
};

const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [formData, setFormData] = useState(emptyLead);
  const [editData, setEditData] = useState(emptyLead);
  const [editId, setEditId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      Sonner.toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  const createLead = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      Sonner.toast.error('Name and email are required');
      return;
    }
    setIsSaving(true);
    try {
      const { error } = await supabase.from('leads').insert({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        message: formData.message.trim() || null,
        service_interest: formData.service_interest.trim() || null,
        status: formData.status || 'new',
        notes: formData.notes.trim() || null,
      });

      if (error) throw error;
      Sonner.toast.success('Lead created successfully');
      setIsCreateOpen(false);
      setFormData(emptyLead);
      fetchLeads();
    } catch (error) {
      console.error('Error creating lead:', error);
      Sonner.toast.error('Failed to create lead');
    } finally {
      setIsSaving(false);
    }
  };

  const openEditModal = (lead: Lead) => {
    setEditId(lead.id);
    setEditData({
      name: lead.name || '',
      email: lead.email || '',
      phone: lead.phone || '',
      message: lead.message || '',
      service_interest: lead.service_interest || '',
      status: lead.status || 'new',
      notes: lead.notes || '',
    });
    setIsEditOpen(true);
  };

  const updateLead = async () => {
    if (!editId || !editData.name.trim() || !editData.email.trim()) {
      Sonner.toast.error('Name and email are required');
      return;
    }
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('leads')
        .update({
          name: editData.name.trim(),
          email: editData.email.trim(),
          phone: editData.phone.trim() || null,
          message: editData.message.trim() || null,
          service_interest: editData.service_interest.trim() || null,
          status: editData.status,
          notes: editData.notes.trim() || null,
        })
        .eq('id', editId);

      if (error) throw error;
      Sonner.toast.success('Lead updated successfully');
      setIsEditOpen(false);
      setEditId(null);
      setEditData(emptyLead);
      fetchLeads();
    } catch (error) {
      console.error('Error updating lead:', error);
      Sonner.toast.error('Failed to update lead');
    } finally {
      setIsSaving(false);
    }
  };

  const updateLeadStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      Sonner.toast.success(`Status updated to ${status}`);
      fetchLeads();
    } catch (error) {
      Sonner.toast.error('Failed to update status');
    }
  };

  const deleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      const { error } = await supabase.from('leads').delete().eq('id', id);
      if (error) throw error;
      Sonner.toast.success('Lead deleted successfully');
      fetchLeads();
    } catch (error) {
      Sonner.toast.error('Failed to delete lead');
    }
  };

  const saveNotes = async () => {
    if (!selectedLead) return;
    try {
      const { error } = await supabase
        .from('leads')
        .update({ notes })
        .eq('id', selectedLead.id);

      if (error) throw error;
      Sonner.toast.success('Notes saved');
      fetchLeads();
      setIsDetailOpen(false);
    } catch (error) {
      Sonner.toast.error('Failed to save notes');
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'new': return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">New</Badge>;
      case 'contacted': return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Contacted</Badge>;
      case 'converted': return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Converted</Badge>;
      case 'closed': return <Badge variant="outline" className="bg-slate-100 text-slate-500 border-slate-200">Closed</Badge>;
      default: return <Badge variant="outline">{status || 'Unknown'}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <h2 className="text-2xl font-bold text-slate-900 font-heading">Leads Management</h2>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter size={18} />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setStatusFilter('all')}>All Statuses</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('new')}>New</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('contacted')}>Contacted</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('converted')}>Converted</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('closed')}>Closed</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            onClick={() => {
              setFormData(emptyLead);
              setIsCreateOpen(true);
            }}
            className="gap-2 bg-brand-blue hover:bg-brand-blue/90"
          >
            <Plus size={18} />
            New Lead
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Contact Info</TableHead>
              <TableHead className="font-semibold">Service</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-slate-400">Loading leads...</TableCell>
              </TableRow>
            ) : filteredLeads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-slate-400">No leads found</TableCell>
              </TableRow>
            ) : (
              filteredLeads.map((lead) => (
                <TableRow key={lead.id} className="hover:bg-slate-50 transition-colors">
                  <TableCell className="font-medium text-slate-900">{lead.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <span className="text-slate-600">{lead.email}</span>
                      <span className="text-slate-400 text-xs">{lead.phone || 'No phone'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">{lead.service_interest || 'General'}</TableCell>
                  <TableCell>{getStatusBadge(lead.status)}</TableCell>
                  <TableCell className="text-sm text-slate-500">
                    {lead.created_at && format(new Date(lead.created_at), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-slate-400">
                          <MoreVertical size={18} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => {
                          setSelectedLead(lead);
                          setNotes(lead.notes || '');
                          setIsDetailOpen(true);
                        }} className="gap-2">
                          <Eye size={16} /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditModal(lead)} className="gap-2">
                          <Pencil size={16} /> Edit Lead
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateLeadStatus(lead.id, 'contacted')} className="gap-2">
                          <Clock size={16} /> Mark Contacted
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateLeadStatus(lead.id, 'converted')} className="gap-2 text-green-600">
                          <UserCheck size={16} /> Mark Converted
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteLead(lead.id)} className="gap-2 text-red-600">
                          <Trash2 size={16} /> Delete Lead
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

      {/* Lead Details Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
            <DialogDescription>Full information for {selectedLead?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-400 font-medium mb-1">Email</p>
                <p className="text-slate-900">{selectedLead?.email}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium mb-1">Phone</p>
                <p className="text-slate-900">{selectedLead?.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium mb-1">Service Interest</p>
                <p className="text-slate-900">{selectedLead?.service_interest || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium mb-1">Received</p>
                <p className="text-slate-900">{selectedLead?.created_at && format(new Date(selectedLead.created_at), 'PPP')}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-slate-400 font-medium text-sm">Message</p>
              <div className="p-3 bg-slate-50 rounded-lg text-sm text-slate-700">
                {selectedLead?.message || 'No message provided'}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-slate-400 font-medium text-sm">Admin Notes</p>
              <Textarea
                placeholder="Add notes about this lead..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>Cancel</Button>
            <Button onClick={saveNotes}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Lead Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Lead</DialogTitle>
            <DialogDescription>Add a new lead manually to track potential clients</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  placeholder="+254 700 000 000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Service Interest</Label>
                <Input
                  placeholder="Web Development"
                  value={formData.service_interest}
                  onChange={(e) => setFormData({ ...formData, service_interest: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                placeholder="What does the lead need?"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label>Admin Notes</Label>
              <Textarea
                placeholder="Internal notes about this lead..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="min-h-[60px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button
              onClick={createLead}
              disabled={isSaving}
              className="gap-2 bg-brand-blue hover:bg-brand-blue/90"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Plus size={16} />
              )}
              Create Lead
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Lead Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Lead</DialogTitle>
            <DialogDescription>Update lead information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                  placeholder="John Doe"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  placeholder="+254 700 000 000"
                  value={editData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Service Interest</Label>
                <Input
                  placeholder="Web Development"
                  value={editData.service_interest}
                  onChange={(e) => setEditData({ ...editData, service_interest: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={editData.status}
                onValueChange={(value) => setEditData({ ...editData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                placeholder="What does the lead need?"
                value={editData.message}
                onChange={(e) => setEditData({ ...editData, message: e.target.value })}
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label>Admin Notes</Label>
              <Textarea
                placeholder="Internal notes about this lead..."
                value={editData.notes}
                onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                className="min-h-[60px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button
              onClick={updateLead}
              disabled={isSaving}
              className="gap-2 bg-brand-blue hover:bg-brand-blue/90"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Pencil size={16} />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Leads;
