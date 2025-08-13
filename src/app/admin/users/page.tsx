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
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Mail,
  Calendar,
  Shield,
  ArrowLeft,
  Download,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  subscription_status: string;
  subscription_plan: string;
  created_at: string;
  last_sign_in_at: string;
  canvas_count: number;
  is_verified: boolean;
}

export default function AdminUsersPage() {
  const { userData } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
      fetchUsers();
    }
  }, [userData, router, toast]);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, statusFilter, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch users with canvas count
      const { data: userProfiles, error } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          full_name,
          role,
          subscription_status,
          subscription_plan,
          created_at,
          last_sign_in_at,
          is_verified
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch canvas count for each user
      const usersWithCanvasCount = await Promise.all(
        userProfiles.map(async (user) => {
          const { count: canvasCount } = await supabase
            .from('canvases')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);

          return {
            ...user,
            canvas_count: canvasCount || 0
          };
        })
      );

      setUsers(usersWithCanvasCount);

    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.subscription_status === statusFilter);
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User role updated successfully.",
      });

      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role.",
        variant: "destructive"
      });
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      // Delete user's canvases first
      await supabase
        .from('canvases')
        .delete()
        .eq('user_id', userId);

      // Delete user profile
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User deleted successfully.",
      });

      setShowDeleteDialog(false);
      setSelectedUser(null);
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user.",
        variant: "destructive"
      });
    }
  };

  const exportUsers = () => {
    const csvContent = [
      ['Email', 'Full Name', 'Role', 'Subscription Status', 'Plan', 'Created At', 'Canvas Count'],
      ...filteredUsers.map(user => [
        user.email,
        user.full_name || '',
        user.role,
        user.subscription_status,
        user.subscription_plan || '',
        new Date(user.created_at).toLocaleDateString(),
        user.canvas_count.toString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
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
      default:
        return <Badge variant="secondary">Free</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-500">Admin</Badge>;
      case 'user':
        return <Badge variant="secondary">User</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
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
              <h1 className="text-3xl font-bold">User Management</h1>
              <p className="text-muted-foreground">Manage all users on the platform</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportUsers}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={fetchUsers}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(u => u.subscription_status === 'active').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(u => {
                  const userDate = new Date(u.created_at);
                  const startOfMonth = new Date();
                  startOfMonth.setDate(1);
                  startOfMonth.setHours(0, 0, 0, 0);
                  return userDate >= startOfMonth;
                }).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified Users</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(u => u.is_verified).length}
              </div>
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
                  placeholder="Search users..."
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
                  <SelectItem value="free">Free</SelectItem>
                </SelectContent>
              </Select>

              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="User Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>

              <div className="text-sm text-muted-foreground flex items-center">
                Showing {filteredUsers.length} of {users.length} users
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>A list of all users on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Canvases</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Last Sign In</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.email}</div>
                        <div className="text-sm text-muted-foreground">
                          {user.full_name || 'No name provided'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getRoleBadge(user.role)}
                    </TableCell>
                    <TableCell>
                      <div>
                        {getStatusBadge(user.subscription_status)}
                        {user.subscription_plan && (
                          <div className="text-sm text-muted-foreground">
                            {user.subscription_plan}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{user.canvas_count}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {user.last_sign_in_at 
                          ? new Date(user.last_sign_in_at).toLocaleDateString()
                          : 'Never'
                        }
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserDialog(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            // Handle edit user
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {user.role !== 'admin' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowDeleteDialog(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No users found matching your criteria.
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Details Dialog */}
        <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
              <DialogDescription>
                Detailed information about {selectedUser?.email}
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <p className="text-sm text-muted-foreground">
                      {selectedUser.full_name || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Role</label>
                    <div className="mt-1">{getRoleBadge(selectedUser.role)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Subscription</label>
                    <div className="mt-1">{getStatusBadge(selectedUser.subscription_status)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Plan</label>
                    <p className="text-sm text-muted-foreground">
                      {selectedUser.subscription_plan || 'Free'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Canvas Count</label>
                    <p className="text-sm text-muted-foreground">{selectedUser.canvas_count}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Joined</label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedUser.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Last Sign In</label>
                    <p className="text-sm text-muted-foreground">
                      {selectedUser.last_sign_in_at 
                        ? new Date(selectedUser.last_sign_in_at).toLocaleDateString()
                        : 'Never'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <label className="text-sm font-medium">Change Role</label>
                  <Select
                    value={selectedUser.role}
                    onValueChange={(newRole) => updateUserRole(selectedUser.id, newRole)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowUserDialog(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete User</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {selectedUser?.email}? This action cannot be undone.
                All their canvases will also be deleted.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => selectedUser && deleteUser(selectedUser.id)}
              >
                Delete User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
