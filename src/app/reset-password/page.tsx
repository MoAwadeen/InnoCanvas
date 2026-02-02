'use client';

import Link from "next/link";
import { useState } from 'react';
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
import { Loader, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/logo";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { toast } = useToast();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        throw error;
      }

      setIsSent(true);
      toast({
        title: 'Reset Email Sent',
        description: 'Check your email for password reset instructions.',
      });

    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        title: 'Reset Failed',
        description: error.message || 'Failed to send reset email. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden" style={{ background: '#0d0d1a' }}>
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        <div className="w-full max-w-md z-10 fade-in-up">
          <Card className="border-0 glass-strong shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold gradient-text mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Check Your Email
              </CardTitle>
              <CardDescription className="text-[var(--text-secondary)]">
                We&apos;ve sent password reset instructions to {email}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-[var(--text-muted)] text-sm">
                Didn&apos;t receive the email? Check your spam folder or try again.
              </p>
              <Button
                onClick={() => setIsSent(false)}
                className="w-full btn-primary text-base"
              >
                Try Again
              </Button>
              <Link href="/login" className="block text-[var(--accent-1)] hover:text-[var(--accent-3)] text-sm transition-colors duration-200">
                &larr; Back to Login
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden" style={{ background: '#0d0d1a' }}>
      {/* Animated background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Logo */}
      <div className="absolute top-8 left-8 z-10">
        <Logo href="/" />
      </div>

      <div className="w-full max-w-md z-10 fade-in-up">
        <Card className="border-0 glass-strong shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold gradient-text mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Reset Password
            </CardTitle>
            <CardDescription className="text-[var(--text-secondary)]">
              Enter your email to receive reset instructions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[var(--text-secondary)] text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/5 border-[var(--glass-border-strong)] text-white placeholder:text-[var(--text-muted)] focus:border-[var(--accent-1)] focus:ring-[var(--accent-1)]/20"
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full btn-primary text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    Sending...
                  </div>
                ) : (
                  'Send Reset Email'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 text-[var(--accent-1)] hover:text-[var(--accent-3)] text-sm transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
