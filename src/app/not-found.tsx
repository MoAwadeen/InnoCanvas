import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-zinc-100 font-bold tracking-tight text-lg hover:text-white duration-200">InnoCanvas</Link>
        </div>
        
        <div className="mb-8">
          <div className="text-6xl font-bold text-primary mb-4">404</div>
          <h1 className="text-2xl font-semibold mb-2">Page Not Found</h1>
          <p className="text-muted-foreground mb-6">
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link href="/">
            <Button className="w-full sm:w-auto">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          </Link>
          <Button variant="outline" onClick={() => window.history.back()} className="w-full sm:w-auto">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          <p className="mb-2">Looking for something specific?</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link href="/generate" className="text-primary hover:underline">
              Generate BMC
            </Link>
            <span className="hidden sm:inline">•</span>
            <Link href="/login" className="text-primary hover:underline">
              Login
            </Link>
            <span className="hidden sm:inline">•</span>
            <Link href="/register" className="text-primary hover:underline">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}