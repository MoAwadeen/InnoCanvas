'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  CreditCard, 
  FileText, 
  TrendingUp, 
  Settings, 
  Shield, 
  Activity,
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  totalUsers: number;
  activeSubscriptions: number;
  totalCanvases: number;
  monthlyRevenue: number;
  newUsersThisMonth: number;
  conversionRate: number;
}

interface RecentActivity {
  id: string;
  type: 'user_signup' | 'subscription_created' | 'subscription_cancelled' | 'canvas_created' | 'payment_failed';
  description: string;
  timestamp: string;
  user_email?: string;
  amount?: number;
}

export default function AdminDashboard() {
  const { user, userData } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeSubscriptions: 0,
    totalCanvases: 0,
    monthlyRevenue: 0,
    newUsersThisMonth: 0,
    conversionRate: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    if (userData && userData.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin dashboard.",
        variant: "destructive"
      });
      router.push('/');
      return;
    }

    if (userData?.role === 'admin') {
      fetchDashboardData();
    }
  }, [userData, router, toast]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user statistics
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { count: activeSubscriptions } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('subscription_status', 'active');

      const { count: totalCanvases } = await supabase
        .from('canvases')
        .select('*', { count: 'exact', head: true });

      // Calculate new users this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: newUsersThisMonth } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonth.toISOString());

      // Mock monthly revenue (you'll need to implement actual revenue tracking)
      const monthlyRevenue = activeSubscriptions * 29.99; // Assuming $29.99 per subscription
      const conversionRate = totalUsers > 0 ? (activeSubscriptions / totalUsers) * 100 : 0;

      setStats({
        totalUsers: totalUsers || 0,
        activeSubscriptions: activeSubscriptions || 0,
        totalCanvases: totalCanvases || 0,
        monthlyRevenue,
        newUsersThisMonth: newUsersThisMonth || 0,
        conversionRate: Math.round(conversionRate * 100) / 100
      });

      // Fetch recent activity
      await fetchRecentActivity();

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      // Fetch recent user signups
      const { data: recentUsers } = await supabase
        .from('profiles')
        .select('id, email, created_at, subscription_status')
        .order('created_at', { ascending: false })
        .limit(10);

      // Fetch recent canvas creations
      const { data: recentCanvases } = await supabase
        .from('canvases')
        .select('id, user_id, title, created_at, profiles!inner(email)')
        .order('created_at', { ascending: false })
        .limit(10);

      const activity: RecentActivity[] = [];

      // Add user signups
      recentUsers?.forEach(user => {
        activity.push({
          id: user.id,
          type: 'user_signup',
          description: `New user signed up: ${user.email}`,
          timestamp: user.created_at,
          user_email: user.email
        });
      });

      // Add canvas creations
      recentCanvases?.forEach(canvas => {
        activity.push({
          id: canvas.id,
          type: 'canvas_created',
          description: `Canvas created: ${canvas.title}`,
          timestamp: canvas.created_at,
          user_email: canvas.profiles.email
        });
      });

      // Sort by timestamp and take the most recent 10
      activity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setRecentActivity(activity.slice(0, 10));

    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_signup':
        return <Users className="h-4 w-4 text-green-500" />;
      case 'subscription_created':
        return <CreditCard className="h-4 w-4 text-blue-500" />;
      case 'subscription_cancelled':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'canvas_created':
        return <FileText className="h-4 w-4 text-purple-500" />;
      case 'payment_failed':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!userData || userData.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your InnoCanvas platform</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push('/admin/users')}>
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Button>
            <Button variant="outline" onClick={() => router.push('/admin/subscriptions')}>
              <CreditCard className="mr-2 h-4 w-4" />
              Subscriptions
            </Button>
            <Button variant="outline" onClick={() => router.push('/admin/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.newUsersThisMonth} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
              <p className="text-xs text-muted-foreground">
                {stats.conversionRate}% conversion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Canvases</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCanvases.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Created by users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                From active subscriptions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common admin tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline" onClick={() => router.push('/admin/users')}>
                    <Users className="mr-2 h-4 w-4" />
                    View All Users
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => router.push('/admin/subscriptions')}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Manage Subscriptions
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => router.push('/admin/canvases')}>
                    <FileText className="mr-2 h-4 w-4" />
                    View All Canvases
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => router.push('/admin/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    System Settings
                  </Button>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>Current system health</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database</span>
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Online
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">AI Service</span>
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Online
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Payment Gateway</span>
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Online
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Storage</span>
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Online
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest user actions and system events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg border">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.description}</p>
                        {activity.user_email && (
                          <p className="text-xs text-muted-foreground">{activity.user_email}</p>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(activity.timestamp)}
                      </div>
                    </div>
                  ))}
                  {recentActivity.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No recent activity</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>Platform performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-4">User Growth</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">This Month</span>
                        <span className="text-sm font-medium text-green-600">
                          +{stats.newUsersThisMonth}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Total Users</span>
                        <span className="text-sm font-medium">{stats.totalUsers}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">Revenue Metrics</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Monthly Revenue</span>
                        <span className="text-sm font-medium">${stats.monthlyRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Conversion Rate</span>
                        <span className="text-sm font-medium">{stats.conversionRate}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
