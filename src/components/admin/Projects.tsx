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
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Plus, 
  Calendar, 
  DollarSign, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  Loader2 
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

const Projects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    client_id: '',
    status: 'pending',
    budget: '',
    deadline: '',
    progress: 0,
    description: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsRes, clientsRes] = await Promise.all([
        supabase.from('projects').select('*, clients(name)').order('created_at', { ascending: false }),
        supabase.from('clients').select('id, name').order('name')
      ]);

      if (projectsRes.error) throw projectsRes.error;
      if (clientsRes.error) throw clientsRes.error;

      setProjects(projectsRes.data || []);
      setClients(clientsRes.data || []);
    } catch (error) {
      Sonner.toast.error('Failed to load project data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (project?: any) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        client_id: project.client_id || '',
        status: project.status || 'pending',
        budget: project.budget?.toString() || '',
        deadline: project.deadline ? format(new Date(project.deadline), 'yyyy-MM-dd') : '',
        progress: project.progress || 0,
        description: project.description || ''
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: '',
        client_id: '',
        status: 'pending',
        budget: '',
        deadline: '',
        progress: 0,
        description: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
        progress: parseInt(formData.progress.toString())
      };

      if (editingProject) {
        const { error } = await supabase.from('projects').update(payload).eq('id', editingProject.id);
        if (error) throw error;
        Sonner.toast.success('Project updated');
      } else {
        const { error } = await supabase.from('projects').insert([payload]);
        if (error) throw error;
        Sonner.toast.success('Project created');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      Sonner.toast.error('Failed to save project');
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      Sonner.toast.success('Project deleted');
      fetchData();
    } catch (error) {
      Sonner.toast.error('Delete failed');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">Pending</Badge>;
      case 'in_progress': return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">In Progress</Badge>;
      case 'completed': return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Completed</Badge>;
      case 'on_hold': return <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">On Hold</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900 font-heading">Projects</h2>
        <Button onClick={() => handleOpenModal()} className="gap-2 bg-brand-blue hover:bg-brand-blue/90">
          <Plus size={18} /> New Project
        </Button>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">Loading...</TableCell>
              </TableRow>
            ) : projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">No projects found</TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id} className="hover:bg-slate-50">
                  <TableCell className="font-medium text-slate-900">{project.title}</TableCell>
                  <TableCell className="text-sm text-slate-600">{project.clients?.name || 'Unassigned'}</TableCell>
                  <TableCell>{getStatusBadge(project.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm font-medium text-slate-700">
                      <DollarSign size={14} className="text-slate-400" />
                      {project.budget?.toLocaleString() || '0'}
                    </div>
                  </TableCell>
                  <TableCell>
                    {project.deadline ? (
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Calendar size={14} />
                        {format(new Date(project.deadline), 'MMM dd, yyyy')}
                      </div>
                    ) : <span className="text-slate-300 text-xs">No date</span>}
                  </TableCell>
                  <TableCell className="min-w-[120px]">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-1.5" />
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
                        <DropdownMenuItem onClick={() => handleOpenModal(project)} className="gap-2">
                          <Edit size={16} /> Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-red-600" onClick={() => deleteProject(project.id)}>
                          <Trash2 size={16} /> Delete Project
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
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingProject ? 'Edit Project' : 'Create New Project'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input 
                id="title" required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Client</Label>
                <Select 
                  value={formData.client_id} 
                  onValueChange={(v) => setFormData({...formData, client_id: v})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(v) => setFormData({...formData, status: v})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget ($)</Label>
                <Input 
                  id="budget" type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input 
                  id="deadline" type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="progress">Progress ({formData.progress}%)</Label>
              </div>
              <Input 
                id="progress" type="range" min="0" max="100" step="5"
                value={formData.progress}
                onChange={(e) => setFormData({...formData, progress: parseInt(e.target.value)})}
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="desc">Description</Label>
              <Input 
                id="desc"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit">Save Project</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Projects;
