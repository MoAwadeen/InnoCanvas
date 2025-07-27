
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, PlusCircle } from 'lucide-react';

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
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0a0a23] via-[#000428] to-[#004e92] text-white p-4 md:p-8">
      <header className="flex justify-between items-center mb-8">
        <Link href="/" className="flex items-center gap-2">
          <Bot className="h-8 w-8 text-primary" />
          <span className="font-bold text-2xl">InnoCanvas</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/generate">
            <Button className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
              <PlusCircle className="mr-2" />
              New Canvas
            </Button>
          </Link>
          <Button variant="outline">Logout</Button>
        </div>
      </header>

      <main>
        <h1 className="text-4xl font-bold mb-8">My Canvases</h1>
        {mockCanvases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockCanvases.map((canvas) => (
              <Card
                key={canvas.id}
                className="bg-white/10 backdrop-blur-lg border-border/20 text-white flex flex-col"
              >
                <CardHeader>
                  <CardTitle>{canvas.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground line-clamp-3">{canvas.preview}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">{canvas.date}</p>
                  <Link href={`/generate?canvasId=${canvas.id}`}>
                    <Button variant="secondary">Open</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-border/20 rounded-2xl">
            <h2 className="text-2xl font-semibold mb-4">No Canvases Yet</h2>
            <p className="text-muted-foreground mb-6">
              Click the button below to start creating your first Business Model Canvas.
            </p>
            <Link href="/generate">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
                Create New Canvas
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

    

    