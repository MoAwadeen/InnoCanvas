'use client';

import Link from "next/link";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader, ArrowLeft, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
      if (error) throw error;
      setIsSent(true);
      toast({ title: 'Reset Email Sent', description: 'Check your email for password reset instructions.' });
    } catch (error: any) {
      toast({ title: 'Reset Failed', description: error.message || 'Failed to send reset email.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center p-4">
        <div className="absolute top-8 left-8">
          <Link href="/" className="text-zinc-100 font-bold tracking-tight text-lg duration-200 hover:text-white">
            InnoCanvas
          </Link>
        </div>
        <div className="w-full max-w-md">
          <div className="border border-zinc-800 rounded-xl p-8 text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#77ff00]/10 border border-[#77ff00]/20">
              <Mail className="h-6 w-6 text-[#77ff00]" />
            </div>
            <h1 className="text-2xl font-bold text-zinc-100 tracking-tight mb-2">Check Your Email</h1>
            <p className="text-sm text-zinc-500 mb-6">
              We&apos;ve sent password reset instructions to <span className="text-zinc-300">{email}</span>
            </p>
            <p className="text-xs text-zinc-600 mb-6">
              Didn&apos;t receive the email? Check your spam folder or try again.
            </p>
            <Button
              onClick={() => setIsSent(false)}
              className="w-full bg-[#77ff00] hover:bg-[#88ff22] text-black font-semibold rounded-lg duration-200 mb-3"
            >
              Try Again
            </Button>
            <Link href="/login" className="flex items-center justify-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 duration-200">
              <ArrowLeft className="w-3 h-3" /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center p-4">
      <div className="absolute top-8 left-8">
        <Link href="/" className="text-zinc-100 font-bold tracking-tight text-lg duration-200 hover:text-white">
          InnoCanvas
        </Link>
      </div>

      <div className="w-full max-w-md">
        <div className="border border-zinc-800 rounded-xl p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Reset Password</h1>
            <p className="text-sm text-zinc-500 mt-2">Enter your email to receive reset instructions</p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-zinc-300">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-[#77ff00]/30 focus-visible:border-[#77ff00]"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#77ff00] hover:bg-[#88ff22] text-black font-semibold rounded-lg duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <><Loader className="mr-2 w-4 h-4 animate-spin" />Sending...</>
              ) : 'Send Reset Email'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 duration-200"
            >
              <ArrowLeft className="w-3 h-3" /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
