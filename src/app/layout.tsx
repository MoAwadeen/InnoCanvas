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
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><style>.block{fill:white;ry:8px;}.text{fill:%23FF33AF;font-family:Inter,sans-serif;font-weight:bold;font-size:24px;}</style></defs><rect x='0' y='0' width='48' height='48' class='block'/><rect x='52' y='0' width='48' height='48' class='block'/><rect x='0' y='52' width='48' height='48' class='block'/><rect x='52' y='52' width='48' height='48' class='block'/><text x='5' y='32' class='text'>Inno</text><text x='54' y='84' class='text'>Canvas</text></svg>" />
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
