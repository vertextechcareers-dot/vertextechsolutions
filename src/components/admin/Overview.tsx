import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Briefcase, MessageSquare, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import * as Sonner from 'sonner';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';

const Overview = () => {
  const [stats, setStats] = useState({
    leads: 0,
    projects: 0,
    clients: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
    generateChartData();
    fetchRecentActivity();
  }, []);

  const fetchStats = async () => {
    try {
      const { count: leadsCount } = await supabase.from('leads').select('*', { count: 'exact', head: true });
      const { count: projectsCount } = await supabase.from('projects').select('*', { count: 'exact', head: true });
      const { count: clientsCount } = await supabase.from('clients').select('*', { count: 'exact', head: true });
      
      // Calculate revenue from projects budget
      const { data: projectsData } = await supabase.from('projects').select('budget');
      const totalRevenue = projectsData?.reduce((acc, curr) => acc + (Number(curr.budget) || 0), 0) || 0;

      setStats({
        leads: leadsCount || 0,
        projects: projectsCount || 0,
        clients: clientsCount || 0,
        revenue: totalRevenue,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      Sonner.toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = () => {
    // Generate dummy data for the last 7 days for the overview chart
    const data = Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(new Date(), 6 - i);
      return {
        name: format(date, 'MMM dd'),
        leads: Math.floor(Math.random() * 20) + 5,
        conversions: Math.floor(Math.random() * 10) + 2,
      };
    });
    setChartData(data);
  };

  const fetchRecentActivity = async () => {
    try {
      const { data: leads } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
      
      const { data: messages } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      const activity = [
        ...(leads?.map(l => ({ ...l, type: 'lead' })) || []),
        ...(messages?.map(m => ({ ...m, type: 'message' })) || [])
      ].sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
      .slice(0, 5);

      setRecentActivity(activity);
    } catch (error) {
      console.error('Error fetching activity:', error);
    }
  };

  const statCards = [
    { title: 'Total Leads', value: stats.leads, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', change: '+12%', positive: true },
    { title: 'Active Projects', value: stats.projects, icon: Briefcase, color: 'text-green-600', bg: 'bg-green-50', change: '+5%', positive: true },
    { title: 'Total Clients', value: stats.clients, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50', change: '+8%', positive: true },
    { title: 'Total Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50', change: '+15%', positive: true },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-3 rounded-xl", stat.bg)}>
                  <stat.icon className={stat.color} size={24} />
                </div>
                <div className={cn(
                  "flex items-center text-xs font-medium px-2 py-1 rounded-full",
                  stat.positive ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
                )}>
                  {stat.positive ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                  {stat.change}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Growth Overview</CardTitle>
              <p className="text-sm text-slate-500">Leads and conversions over the last 7 days</p>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1E7FD8" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#1E7FD8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3DBE5B" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3DBE5B" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="leads" 
                    stroke="#1E7FD8" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorLeads)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="conversions" 
                    stroke="#3DBE5B" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorConv)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentActivity.length > 0 ? (
                recentActivity.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                      item.type === 'lead' ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"
                    )}>
                      {item.type === 'lead' ? <Users size={18} /> : <MessageSquare size={18} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {item.type === 'lead' ? 'New Lead' : 'New Message'} from {item.name}
                      </p>
                      <p className="text-xs text-slate-500 line-clamp-1">{item.email}</p>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">
                        {item.created_at ? format(new Date(item.created_at), 'MMM dd, HH:mm') : 'Recently'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-slate-400">No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

import { cn } from '@/lib/utils';

export default Overview;
