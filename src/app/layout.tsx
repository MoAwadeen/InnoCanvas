import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/hooks/useAuth';

export const metadata: Metadata = {
  title: 'InnoCanvas: AI Business Model Canvas Generator',
  description: 'Turn your idea into a business model instantly with InnoCanvas. Generate AI-powered Business Model Canvases with beautiful visual templates.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='80' height='60' x='10' y='20' rx='10' fill='%2330A2FF' /><path d='M30 50h40' stroke='white' stroke-width='8' /><circle cx='35' cy='40' r='5' fill='white' /><circle cx='65' cy='40' r='5' fill='white' /></svg>" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" crossOrigin="anonymous" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster />
      </body>
    </html>
  );
}
