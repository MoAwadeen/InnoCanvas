
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { PlusCircle, Trash2, User, LogOut, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState, useCallback } from 'react';
import { Logo } from '@/components/logo';
import { supabase, handleSupabaseError } from '@/lib/supabase';

interface Canvas {
  id: string;
  title: string;
  preview: string;
  date: string;
}

export default function MyCanvasesPage() {
  const { user, userData, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [canvases, setCanvases] = useState<Canvas[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCanvases = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
        const { data, error } = await supabase
            .from('canvases')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        
        const userCanvases = data.map(canvas => {
            const canvasData = canvas.canvas_data || {};
            const previewContent = [canvasData.valuePropositions, canvasData.customerSegments, canvasData.revenueStreams].filter(Boolean).join(' · ');
            return {
                id: canvas.id,
                title: canvas.business_description || 'Untitled Canvas',
                preview: previewContent,
                date: new Date(canvas.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }),
            };
        });
        setCanvases(userCanvases);
    } catch (error: any) {
        console.error("Error fetching canvases: ", error);
        const errorMessage = handleSupabaseError(error, 'Could not fetch your canvases');
        toast({
            title: 'Error',
            description: errorMessage,
            variant: 'destructive'
        });
    } finally {
        setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    fetchCanvases();
  }, [user, authLoading, router, fetchCanvases]);

  useEffect(() => {
    if(!user) return;

    const channel = supabase.channel(`public:canvases:user_id=eq.${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'canvases', filter: `user_id=eq.${user.id}` },
        (payload) => {
           fetchCanvases();
        }
      ).subscribe();

    return () => {
        supabase.removeChannel(channel);
    }
  }, [user, fetchCanvases]);


  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
      router.push('/login');
    } catch (error: any) {
      const errorMessage = handleSupabaseError(error, 'Logout failed');
      toast({
        title: 'Logout Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };
  
  const handleDelete = async (canvasId: string) => {
    if (!user) return;
    try {
      const { error } = await supabase.from('canvases').delete().eq('id', canvasId);
      if (error) throw error;

      toast({
        title: 'Canvas Deleted',
        description: 'Your canvas has been successfully deleted.',
      });
    } catch (error: any) {
       const errorMessage = handleSupabaseError(error, 'Failed to delete canvas');
       toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  };
  
  const displayName = userData?.full_name || user?.email || 'Innovator';

  if (authLoading) {
      return (
            <div className="min-h-screen w-full flex items-center justify-center bg-background">
                <Loader className="w-16 h-16 animate-spin text-primary" />
            </div>
        );
  }


  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground p-4 md:p-8">
      <header className="flex justify-between items-center mb-12">
        <Logo href="/my-canvases" />
        <div className="flex items-center gap-4">
           <Link href="/profile">
            <Button variant="secondary"><User className="mr-2"/>Profile</Button>
           </Link>
           <Button variant="secondary" onClick={handleLogout}><LogOut className="mr-2"/>Logout</Button>
        </div>
      </header>

      <main>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold">Welcome back, {displayName} 👋</h1>
          <p className="text-muted-foreground mt-2 text-lg">Here’s your latest business canvas progress.</p>
        </motion.div>
        
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Your Canvases</h2>
            <Link href="/generate">
                <Button variant="gradient">
                <PlusCircle className="mr-2" />
                Create New Canvas
                </Button>
            </Link>
        </div>


        {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader className="w-12 h-12 animate-spin text-primary" />
            </div>
        ) : canvases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {canvases.map((canvas, index) => (
              <motion.div
                key={canvas.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  className="card-glass flex flex-col h-full bg-secondary/30 p-0"
                >
                  <CardHeader className="p-6">
                    <CardTitle className="line-clamp-2 text-card-foreground">{canvas.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow p-6 pt-0">
                    <p className="text-muted-foreground text-sm line-clamp-3 h-16">{canvas.preview}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center mt-auto p-6 pt-4 border-t border-white/10">
                    <p className="text-sm text-muted-foreground">{canvas.date}</p>
                    <div className="flex gap-2">
                        <Link href={`/generate?canvasId=${canvas.id}`}>
                            <Button variant="secondary">Open</Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your canvas.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(canvas.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-border/20 rounded-2xl bg-secondary/20 flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-4">No Canvases Yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              It looks like your workspace is empty. Let's create your first Business Model Canvas and bring your ideas to life.
            </p>
            <Link href="/generate">
                 <Button variant="gradient" size="lg" className="h-24 w-24 rounded-full p-0 flex items-center justify-center">
                    <PlusCircle className="h-12 w-12" />
                </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
