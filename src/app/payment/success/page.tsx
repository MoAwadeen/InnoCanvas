'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Sparkles, ArrowRight } from "lucide-react";
import { Logo } from "@/components/logo";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // Get user data from localStorage or session
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserData(user);
    setLoading(false);
  }, []);

  const handleContinue = () => {
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Processing your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center p-4 md:p-8">
      <header className="w-full max-w-2xl flex justify-center items-center mb-8">
        <Logo />
      </header>

      <main className="w-full max-w-2xl flex-grow">
        <Card className="w-full border-border text-center">
          <CardHeader className="pb-4">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <CheckCircle className="w-16 h-16 text-green-500" />
                <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-green-500">
              Payment Successful!
            </CardTitle>
            <CardDescription className="text-lg">
              Welcome to InnoCanvas Premium! 🎉
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">What's Next?</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Create unlimited Business Model Canvases</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Export high-quality PDFs without watermarks</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Access advanced AI features and templates</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Customize colors and branding</span>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                You'll receive a confirmation email shortly. If you have any questions,
                don't hesitate to reach out to our support team.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                onClick={handleContinue}
                className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
              >
                Start Creating
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Link href="/profile" className="flex-1">
                <Button variant="outline" className="w-full">
                  Manage Account
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Need help? Contact us at{' '}
            <a href="mailto:support@innocanvas.site" className="text-primary hover:underline">
              support@innocanvas.site
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
