'use client';
export const dynamic = "force-dynamic";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { supabase, handleSupabaseError } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export default function VerifyEmailPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const emailParam = new URLSearchParams(window.location.search).get('email');
      if (emailParam) setEmail(emailParam);
    }
  }, []);

  const handleResendVerification = async () => {
    if (!email) { toast({ title: 'Email Required', description: 'Please enter your email address.', variant: 'destructive' }); return; }
    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup', email,
        options: { emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined },
      });
      if (error) throw error;
      toast({ title: 'Verification Email Sent', description: 'Please check your email for the verification link.' });
    } catch (error: any) {
      toast({ title: 'Error', description: handleSupabaseError(error, 'Failed to resend verification email'), variant: 'destructive' });
    } finally {
      setIsResending(false);
    }
  };

  const handleManualVerification = async () => {
    if (!email) { toast({ title: 'Email Required', description: 'Please enter your email address.', variant: 'destructive' }); return; }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined },
      });
      if (error) throw error;
      toast({ title: 'Magic Link Sent', description: 'Check your email for a magic link to sign in.' });
    } catch (error: any) {
      toast({ title: 'Error', description: handleSupabaseError(error, 'Failed to send magic link'), variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center p-4">
      <div className="absolute top-8 left-8">
        <Link href="/" className="text-zinc-100 font-bold tracking-tight text-lg duration-200 hover:text-white">
          InnoCanvas
        </Link>
      </div>

      <div className="w-full max-w-md">
        <div className="border border-zinc-800 rounded-xl p-8">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#77ff00]/10 border border-[#77ff00]/20">
            <Mail className="h-6 w-6 text-[#77ff00]" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight mb-2">Verify Your Email</h1>
          <p className="text-sm text-zinc-500 mb-8">Enter your email to resend verification or get a magic link.</p>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-zinc-300">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-[#77ff00]/30 focus-visible:border-[#77ff00]"
              />
            </div>

            <Button
              onClick={handleResendVerification}
              disabled={isResending || !email}
              variant="outline"
              className="w-full border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 duration-200"
            >
              {isResending ? <><RefreshCw className="mr-2 h-4 w-4 animate-spin" />Sending...</> : <><Mail className="mr-2 h-4 w-4" />Resend Verification Email</>}
            </Button>

            <Button
              onClick={handleManualVerification}
              disabled={isLoading || !email}
              className="w-full bg-[#77ff00] hover:bg-[#88ff22] text-black font-semibold rounded-lg duration-200"
            >
              {isLoading ? <><RefreshCw className="mr-2 h-4 w-4 animate-spin" />Sending...</> : <><CheckCircle className="mr-2 h-4 w-4" />Send Magic Link</>}
            </Button>
          </div>

          <div className="mt-6 p-3 bg-zinc-900 rounded-lg border border-zinc-800">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-zinc-500 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-zinc-500 space-y-1">
                <p className="font-medium text-zinc-400">Troubleshooting tips:</p>
                <p>• Check your spam/junk folder</p>
                <p>• Make sure you entered the correct email</p>
                <p>• Try the magic link option if verification doesn&apos;t work</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button asChild variant="outline" className="border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 duration-200">
              <Link href="/login">Back to Sign In</Link>
            </Button>
            <Button asChild variant="outline" className="border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 duration-200">
              <Link href="/register">Create Account</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
