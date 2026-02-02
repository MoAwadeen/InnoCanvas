'use client';
export const dynamic = "force-dynamic";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { Logo } from "@/components/logo";
import { supabase, handleSupabaseError } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export default function VerifyEmailPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();

  // Get email from URL params if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const emailParam = urlParams.get('email');
      if (emailParam) {
        setEmail(emailParam);
      }
    }
  }, []);

  const handleResendVerification = async () => {
    if (!email) {
      toast({
        title: 'Email Required',
        description: 'Please enter your email address.',
        variant: 'destructive',
      });
      return;
    }

    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
        }
      });

      if (error) throw error;

      toast({
        title: 'Verification Email Sent',
        description: 'Please check your email for the verification link.',
      });

    } catch (error: any) {
      const errorMessage = handleSupabaseError(error, 'Failed to resend verification email');
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleManualVerification = async () => {
    if (!email) {
      toast({
        title: 'Email Required',
        description: 'Please enter your email address.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
        }
      });

      if (error) throw error;

      toast({
        title: 'Magic Link Sent',
        description: 'Check your email for a magic link to sign in.',
      });

    } catch (error: any) {
      const errorMessage = handleSupabaseError(error, 'Failed to send magic link');
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden" style={{ background: '#0d0d1a' }}>
      {/* Animated background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="absolute top-8 left-8 z-10">
        <Logo href="/" />
      </div>

      <div className="w-full max-w-md z-10 fade-in-up">
        <Card className="border-0 glass-strong shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full" style={{ background: 'linear-gradient(135deg, var(--accent-1), var(--accent-2))' }}>
              <Mail className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-xl font-bold gradient-text" style={{ fontFamily: "'Playfair Display', serif" }}>
              Verify Your Email
            </CardTitle>
            <CardDescription className="text-[var(--text-secondary)]">
              Enter your email address to resend verification or get a magic link.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[var(--text-secondary)] text-sm font-medium">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border-[var(--glass-border-strong)] text-white placeholder:text-[var(--text-muted)] focus:border-[var(--accent-1)] focus:ring-[var(--accent-1)]/20"
              />
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleResendVerification}
                disabled={isResending || !email}
                className="w-full btn-secondary"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Resend Verification Email
                  </>
                )}
              </Button>

              <Button
                onClick={handleManualVerification}
                disabled={isLoading || !email}
                className="w-full btn-primary text-base"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Sending Magic Link...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Send Magic Link
                  </>
                )}
              </Button>
            </div>

            <div className="p-3 glass rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-[var(--accent-3)] mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-[var(--text-secondary)] text-xs">Troubleshooting Tips:</p>
                  <ul className="mt-1 space-y-1 text-[var(--text-muted)] text-xs">
                    <li>Check your spam/junk folder</li>
                    <li>Make sure you entered the correct email</li>
                    <li>Try the magic link option if verification doesn&apos;t work</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full btn-secondary">
                <Link href="/login">
                  Back to Sign In
                </Link>
              </Button>

              <Button asChild className="w-full btn-secondary">
                <Link href="/register">
                  Create New Account
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
