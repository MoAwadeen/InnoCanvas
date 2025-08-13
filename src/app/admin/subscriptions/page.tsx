'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  CreditCard, 
  Search, 
  Filter, 
  Eye, 
  RefreshCw,
  ArrowLeft,
  Download,
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Users
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface Subscription {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  subscription_status: string;
  subscription_plan: string;
  subscription_id: string;
  current_period_start: string;
  current_period_end: string;
  created_at: string;
  updated_at: string;
  canvas_count: number;
}

export default function AdminSubscriptionsPage() {
  const { userData } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);

  useEffect(() => {
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
      fetchSubscriptions();
    }
  }, [userData, router, toast]);

  useEffect(() => {
    filterSubscriptions();
  }, [subscriptions, searchTerm, statusFilter, planFilter]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      
      // Fetch users with subscription data
      const { data: userProfiles, error } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          full_name,
          subscription_status,
          subscription_plan,
          subscription_id,
          current_period_start,
          current_period_end,
          created_at,
          updated_at
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch canvas count for each user
      const subscriptionsWithCanvasCount = await Promise.all(
        userProfiles.map(async (user) => {
          const { count: canvasCount } = await supabase
            .from('canvases')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);

          return {
            id: user.id,
            user_id: user.id,
            email: user.email,
            full_name: user.full_name,
            subscription_status: user.subscription_status,
            subscription_plan: user.subscription_plan,
            subscription_id: user.subscription_id,
            current_period_start: user.current_period_start,
            current_period_end: user.current_period_end,
            created_at: user.created_at,
            updated_at: user.updated_at,
            canvas_count: canvasCount || 0
          };
        })
      );

      setSubscriptions(subscriptionsWithCanvasCount);

    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      toast({
        title: "Error",
        description: "Failed to load subscriptions.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterSubscriptions = () => {
    let filtered = subscriptions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(sub =>
        sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(sub => sub.subscription_status === statusFilter);
    }

    // Plan filter
    if (planFilter !== 'all') {
      filtered = filtered.filter(sub => sub.subscription_plan === planFilter);
    }

    setFilteredSubscriptions(filtered);
  };

  const exportSubscriptions = () => {
    const csvContent = [
      ['Email', 'Full Name', 'Plan', 'Status', 'Period Start', 'Period End', 'Canvas Count'],
      ...filteredSubscriptions.map(sub => [
        sub.email,
        sub.full_name || '',
        sub.subscription_plan || 'Free',
        sub.subscription_status,
        sub.current_period_start ? new Date(sub.current_period_start).toLocaleDateString() : '',
        sub.current_period_end ? new Date(sub.current_period_end).toLocaleDateString() : '',
        sub.canvas_count.toString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscriptions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      case 'past_due':
        return <Badge className="bg-orange-500">Past Due</Badge>;
      case 'trialing':
        return <Badge className="bg-blue-500">Trialing</Badge>;
      default:
        return <Badge variant="secondary">Free</Badge>;
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'pro':
        return <Badge className="bg-blue-500">Pro</Badge>;
      case 'premium':
        return <Badge className="bg-purple-500">Premium</Badge>;
      default:
        return <Badge variant="secondary">Free</Badge>;
    }
  };

  const calculateRevenue = () => {
    const activeSubscriptions = subscriptions.filter(sub => sub.subscription_status === 'active');
    const proCount = activeSubscriptions.filter(sub => sub.subscription_plan === 'pro').length;
    const premiumCount = activeSubscriptions.filter(sub => sub.subscription_plan === 'premium').length;
    
    // Assuming Pro is $29.99 and Premium is $49.99
    return (proCount * 29.99) + (premiumCount * 49.99);
  };

  const getActiveSubscriptionsCount = () => {
    return subscriptions.filter(sub => sub.subscription_status === 'active').length;
  };

  const getExpiringSoonCount = () => {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
    
    return subscriptions.filter(sub => {
      if (sub.current_period_end) {
        const endDate = new Date(sub.current_period_end);
        return endDate <= thirtyDaysFromNow && sub.subscription_status === 'active';
      }
      return false;
    }).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
            <div className="h-64 bg-muted rounded"></div>
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
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push('/admin')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Subscription Management</h1>
              <p className="text-muted-foreground">Manage all user subscriptions</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportSubscriptions}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={fetchSubscriptions}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Subscriptions</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{subscriptions.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getActiveSubscriptionsCount()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${calculateRevenue().toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getExpiringSoonCount()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search subscriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Subscription Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="past_due">Past Due</SelectItem>
                  <SelectItem value="trialing">Trialing</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                </SelectContent>
              </Select>

              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Subscription Plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>

              <div className="text-sm text-muted-foreground flex items-center">
                Showing {filteredSubscriptions.length} of {subscriptions.length} subscriptions
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscriptions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Subscriptions</CardTitle>
            <CardDescription>A list of all user subscriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Canvases</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscriptions.map((subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{subscription.email}</div>
                        <div className="text-sm text-muted-foreground">
                          {subscription.full_name || 'No name provided'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getPlanBadge(subscription.subscription_plan)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(subscription.subscription_status)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {subscription.current_period_start && subscription.current_period_end ? (
                          <>
                            <div>{new Date(subscription.current_period_start).toLocaleDateString()}</div>
                            <div className="text-muted-foreground">to</div>
                            <div>{new Date(subscription.current_period_end).toLocaleDateString()}</div>
                          </>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{subscription.canvas_count}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(subscription.created_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedSubscription(subscription);
                            setShowSubscriptionDialog(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredSubscriptions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No subscriptions found matching your criteria.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subscription Details Dialog */}
        <Dialog open={showSubscriptionDialog} onOpenChange={setShowSubscriptionDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Subscription Details</DialogTitle>
              <DialogDescription>
                Detailed information about {selectedSubscription?.email}'s subscription
              </DialogDescription>
            </DialogHeader>
            {selectedSubscription && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-sm text-muted-foreground">{selectedSubscription.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <p className="text-sm text-muted-foreground">
                      {selectedSubscription.full_name || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Plan</label>
                    <div className="mt-1">{getPlanBadge(selectedSubscription.subscription_plan)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <div className="mt-1">{getStatusBadge(selectedSubscription.subscription_status)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Subscription ID</label>
                    <p className="text-sm text-muted-foreground">
                      {selectedSubscription.subscription_id || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Canvas Count</label>
                    <p className="text-sm text-muted-foreground">{selectedSubscription.canvas_count}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Current Period Start</label>
                    <p className="text-sm text-muted-foreground">
                      {selectedSubscription.current_period_start 
                        ? new Date(selectedSubscription.current_period_start).toLocaleDateString()
                        : 'N/A'
                      }
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Current Period End</label>
                    <p className="text-sm text-muted-foreground">
                      {selectedSubscription.current_period_end 
                        ? new Date(selectedSubscription.current_period_end).toLocaleDateString()
                        : 'N/A'
                      }
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Created</label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedSubscription.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Last Updated</label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedSubscription.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSubscriptionDialog(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
