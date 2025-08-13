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
  FileText, 
  Search, 
  Eye, 
  Trash2, 
  RefreshCw,
  ArrowLeft,
  Download,
  Calendar,
  User,
  TrendingUp,
  Filter
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface Canvas {
  id: string;
  user_id: string;
  title: string;
  description: string;
  content: any;
  created_at: string;
  updated_at: string;
  is_public: boolean;
  user_email: string;
  user_full_name: string;
}

export default function AdminCanvasesPage() {
  const { userData } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [canvases, setCanvases] = useState<Canvas[]>([]);
  const [filteredCanvases, setFilteredCanvases] = useState<Canvas[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState('all');
  const [selectedCanvas, setSelectedCanvas] = useState<Canvas | null>(null);
  const [showCanvasDialog, setShowCanvasDialog] = useState(false);
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
      fetchCanvases();
    }
  }, [userData, router, toast]);

  useEffect(() => {
    filterCanvases();
  }, [canvases, searchTerm, visibilityFilter]);

  const fetchCanvases = async () => {
    try {
      setLoading(true);
      
      // Fetch canvases with user information
      const { data: canvasData, error } = await supabase
        .from('canvases')
        .select(`
          id,
          user_id,
          title,
          description,
          content,
          created_at,
          updated_at,
          is_public,
          profiles!inner(
            email,
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match our interface
      const transformedCanvases = canvasData.map(canvas => ({
        id: canvas.id,
        user_id: canvas.user_id,
        title: canvas.title,
        description: canvas.description,
        content: canvas.content,
        created_at: canvas.created_at,
        updated_at: canvas.updated_at,
        is_public: canvas.is_public,
        user_email: canvas.profiles.email,
        user_full_name: canvas.profiles.full_name
      }));

      setCanvases(transformedCanvases);

    } catch (error) {
      console.error('Error fetching canvases:', error);
      toast({
        title: "Error",
        description: "Failed to load canvases.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterCanvases = () => {
    let filtered = canvases;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(canvas =>
        canvas.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        canvas.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        canvas.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        canvas.user_full_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Visibility filter
    if (visibilityFilter !== 'all') {
      const isPublic = visibilityFilter === 'public';
      filtered = filtered.filter(canvas => canvas.is_public === isPublic);
    }

    setFilteredCanvases(filtered);
  };

  const deleteCanvas = async (canvasId: string) => {
    try {
      const { error } = await supabase
        .from('canvases')
        .delete()
        .eq('id', canvasId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Canvas deleted successfully.",
      });

      setShowDeleteDialog(false);
      setSelectedCanvas(null);
      fetchCanvases(); // Refresh the list
    } catch (error) {
      console.error('Error deleting canvas:', error);
      toast({
        title: "Error",
        description: "Failed to delete canvas.",
        variant: "destructive"
      });
    }
  };

  const exportCanvases = () => {
    const csvContent = [
      ['Title', 'Description', 'User', 'Visibility', 'Created', 'Updated'],
      ...filteredCanvases.map(canvas => [
        canvas.title,
        canvas.description || '',
        canvas.user_email,
        canvas.is_public ? 'Public' : 'Private',
        new Date(canvas.created_at).toLocaleDateString(),
        new Date(canvas.updated_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `canvases-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getVisibilityBadge = (isPublic: boolean) => {
    return isPublic ? (
      <Badge className="bg-green-500">Public</Badge>
    ) : (
      <Badge variant="secondary">Private</Badge>
    );
  };

  const getTotalCanvasesCount = () => {
    return canvases.length;
  };

  const getPublicCanvasesCount = () => {
    return canvases.filter(canvas => canvas.is_public).length;
  };

  const getCanvasesCreatedToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return canvases.filter(canvas => {
      const canvasDate = new Date(canvas.created_at);
      return canvasDate >= today;
    }).length;
  };

  const getAverageCanvasesPerUser = () => {
    if (canvases.length === 0) return 0;
    
    const uniqueUsers = new Set(canvases.map(canvas => canvas.user_id));
    return Math.round((canvases.length / uniqueUsers.size) * 100) / 100;
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
              <h1 className="text-3xl font-bold">Canvas Management</h1>
              <p className="text-muted-foreground">Manage all user-created canvases</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportCanvases}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={fetchCanvases}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Canvases</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTotalCanvasesCount()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Public Canvases</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getPublicCanvasesCount()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Created Today</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getCanvasesCreatedToday()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg per User</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getAverageCanvasesPerUser()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search canvases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Visibility</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>

              <div className="text-sm text-muted-foreground flex items-center">
                Showing {filteredCanvases.length} of {canvases.length} canvases
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Canvases Table */}
        <Card>
          <CardHeader>
            <CardTitle>Canvases</CardTitle>
            <CardDescription>A list of all user-created canvases</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCanvases.map((canvas) => (
                  <TableRow key={canvas.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{canvas.title}</div>
                        {canvas.description && (
                          <div className="text-sm text-muted-foreground truncate max-w-xs">
                            {canvas.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{canvas.user_email}</div>
                        <div className="text-sm text-muted-foreground">
                          {canvas.user_full_name || 'No name provided'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getVisibilityBadge(canvas.is_public)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(canvas.created_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(canvas.updated_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedCanvas(canvas);
                            setShowCanvasDialog(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedCanvas(canvas);
                            setShowDeleteDialog(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredCanvases.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No canvases found matching your criteria.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Canvas Details Dialog */}
        <Dialog open={showCanvasDialog} onOpenChange={setShowCanvasDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Canvas Details</DialogTitle>
              <DialogDescription>
                Detailed information about {selectedCanvas?.title}
              </DialogDescription>
            </DialogHeader>
            {selectedCanvas && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <p className="text-sm text-muted-foreground">{selectedCanvas.title}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">User</label>
                    <p className="text-sm text-muted-foreground">{selectedCanvas.user_email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Visibility</label>
                    <div className="mt-1">{getVisibilityBadge(selectedCanvas.is_public)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Created</label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedCanvas.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Updated</label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedCanvas.updated_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                {selectedCanvas.description && (
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <p className="text-sm text-muted-foreground mt-1">{selectedCanvas.description}</p>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium">Canvas Content</label>
                  <div className="mt-2 p-4 bg-muted rounded-lg max-h-96 overflow-y-auto">
                    <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                      {JSON.stringify(selectedCanvas.content, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCanvasDialog(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Canvas</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedCanvas?.title}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => selectedCanvas && deleteCanvas(selectedCanvas.id)}
              >
                Delete Canvas
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
