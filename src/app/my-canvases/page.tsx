
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
import { Bot, PlusCircle, Trash2, User, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { auth, db } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { collection, query, onSnapshot, deleteDoc, doc } from 'firebase/firestore';

interface Canvas {
  id: string;
  title: string;
  preview: string;
  date: string;
}

export default function MyCanvasesPage() {
  const { user, userData } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [canvases, setCanvases] = useState<Canvas[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    setIsLoading(true);
    const q = query(collection(db, 'users', user.uid, 'canvases'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const userCanvases = querySnapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().businessDescription,
        preview: Object.values(doc.data()).slice(0, 3).join(' '),
        date: doc.data().createdAt?.toDate().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }) || new Date().toLocaleDateString(),
      }));
      setCanvases(userCanvases);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching canvases: ", error);
      toast({
        title: 'Error',
        description: 'Could not fetch your canvases.',
        variant: 'destructive'
      });
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();

  }, [user, router, toast]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
      router.push('/login');
    } catch (error) {
      toast({
        title: 'Logout Failed',
        description: 'There was an error logging you out.',
        variant: 'destructive',
      });
    }
  };
  
  const handleDelete = async (canvasId: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'canvases', canvasId));
      toast({
        title: 'Canvas Deleted',
        description: 'Your canvas has been successfully deleted.',
      });
    } catch (error) {
       toast({
        title: 'Error',
        description: 'Failed to delete canvas.',
        variant: 'destructive'
      });
    }
  };

  if (!user) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground p-4 md:p-8">
      <header className="flex justify-between items-center mb-12">
        <Link href="/" className="flex items-center gap-2">
          <Bot className="h-8 w-8 text-primary" />
          <span className="font-bold text-2xl">InnoCanvas</span>
        </Link>
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
          <h1 className="text-4xl md:text-5xl font-bold">Welcome back, {userData?.fullName || user.displayName || 'Innovator'} 👋</h1>
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
           <div className="text-center py-20">
             <p>Loading your canvases...</p>
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
                  className="flex flex-col h-full hover:border-primary/50 transition-all border-border"
                >
                  <CardHeader>
                    <CardTitle>{canvas.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground line-clamp-3">{canvas.preview}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
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
                              <AlertDialogAction onClick={() => handleDelete(canvas.id)}>Delete</AlertDialogAction>
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
          <div className="text-center py-20 border-2 border-dashed border-border/20 rounded-2xl bg-secondary">
            <h2 className="text-2xl font-semibold mb-4">No Canvases Yet</h2>
            <p className="text-muted-foreground mb-6">
              Click the button above to start creating your first Business Model Canvas.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
