
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
import { Bot, PlusCircle, Trash2, User } from 'lucide-react';
import { motion } from 'framer-motion';

const mockCanvases = [
  {
    id: '1',
    title: 'AR History Tourist App',
    date: 'October 25, 2023',
    preview: 'A mobile app that helps tourists explore historical places using AR...',
  },
  {
    id: '2',
    title: 'AI-Powered Meal Planner',
    date: 'November 02, 2023',
    preview: 'A subscription service that creates custom meal plans based on dietary needs...',
  },
  {
    id: '3',
    title: 'Sustainable Fashion Marketplace',
    date: 'November 15, 2023',
    preview: 'An e-commerce platform connecting consumers with sustainable clothing brands...',
  },
];

export default function MyCanvasesPage() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground p-4 md:p-8">
      <header className="flex justify-between items-center mb-12">
        <Link href="/" className="flex items-center gap-2">
          <Bot className="h-8 w-8 text-primary" />
          <span className="font-bold text-2xl">InnoCanvas</span>
        </Link>
        <div className="flex items-center gap-4">
           <Link href="/profile">
            <Button variant="outline"><User className="mr-2"/>Profile</Button>
           </Link>
           <Link href="/">
            <Button variant="outline">Logout</Button>
          </Link>
        </div>
      </header>

      <main>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold">Welcome back, Mohamed Awadeen 👋</h1>
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


        {mockCanvases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockCanvases.map((canvas, index) => (
              <motion.div
                key={canvas.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  className="flex flex-col h-full hover:border-primary/50 transition-all"
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
                              <AlertDialogAction>Delete</AlertDialogAction>
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
