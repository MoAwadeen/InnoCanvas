import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/hooks/useAuth';
import { Analytics } from "@vercel/analytics/next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: 'InnoCanvas: AI Business Model Canvas Generator',
  description: 'Turn your idea into a business model instantly with InnoCanvas. Generate AI-powered Business Model Canvases with beautiful visual templates. Perfect for entrepreneurs, startups, and business professionals.',
  keywords: 'business model canvas, AI generator, startup tools, business planning, entrepreneurship, BMC, business strategy, AI business tools',
  authors: [{ name: 'InnoCanvas Team' }],
  creator: 'InnoCanvas',
  publisher: 'InnoCanvas',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://innocanvas.site'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'InnoCanvas: AI Business Model Canvas Generator',
    description: 'Turn your idea into a business model instantly with InnoCanvas. Generate AI-powered Business Model Canvases with beautiful visual templates.',
    url: 'https://innocanvas.site',
    siteName: 'InnoCanvas',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'InnoCanvas - AI Business Model Canvas Generator',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InnoCanvas: AI Business Model Canvas Generator',
    description: 'Turn your idea into a business model instantly with InnoCanvas. Generate AI-powered Business Model Canvases with beautiful visual templates.',
    images: ['/images/og-image.png'],
    creator: '@innocanvas',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    // Add other verification codes as needed
  },
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
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" crossOrigin="anonymous" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster />
          <Analytics />
      </body>
    </html>
  );
}
