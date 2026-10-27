import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Wrench, 
  MessageSquare, 
  BarChart3, 
  Settings,
  LogOut,
  ChevronRight,
  Lock,
  Smartphone
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onLogout: () => void;
}

const menuItems = [
  { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
  { id: 'leads', label: 'Leads', icon: Users },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'projects', label: 'Projects', icon: Briefcase },
  { id: 'services', label: 'Services (CMS)', icon: Wrench },
  { id: 'secured-files', label: 'Secured Files', icon: Lock },
  { id: 'app-policies', label: 'Mobile Apps & Legal', icon: Smartphone },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const Sidebar = ({ activeSection, setActiveSection, onLogout }: SidebarProps) => {
  return (
    <aside className="w-64 bg-brand-navy text-white flex flex-col h-full shadow-xl">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-xl font-bold font-heading flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center">
            <VIcon />
          </div>
          Vertex Admin
        </h2>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              activeSection === item.id 
                ? "bg-brand-blue text-white shadow-lg shadow-brand-blue/20" 
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <item.icon size={20} className={cn(
              "transition-colors",
              activeSection === item.id ? "text-white" : "group-hover:text-white"
            )} />
            <span className="font-medium text-sm flex-1 text-left">{item.label}</span>
            {activeSection === item.id && <ChevronRight size={14} className="opacity-50" />}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <Button 
          variant="ghost" 
          onClick={onLogout}
          className="w-full justify-start text-slate-400 hover:text-red-400 hover:bg-red-400/10 gap-3 px-4 py-6 rounded-xl transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </Button>
      </div>
    </aside>
  );
};

const VIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <path d="M4 4L12 20L20 4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default Sidebar;