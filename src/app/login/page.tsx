
'use client';

import Link from "next/link";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { Loader } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/logo";
import { supabase, handleSupabaseError } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { GoogleIcon } from "@/components/ui/google-icon";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    // Redirect if user is already logged in and data is loaded
    if (!authLoading && user) {
        router.push('/my-canvases');
    }
  }, [user, authLoading, router]);

  // Check for email verification message and auth errors
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const message = urlParams.get('message');
      const error = urlParams.get('error');

      if (message === 'check-email') {
        toast({
          title: 'Check Your Email',
          description: 'Please check your email to verify your account before signing in.',
        });
      }

      if (error) {
        let errorMessage = 'Authentication failed. Please try again.';

        switch (error) {
          case 'auth_failed':
            errorMessage = 'Authentication failed. Please check your credentials and try again.';
            break;
          case 'hash_callback_failed':
            errorMessage = 'Google authentication failed. Please try again.';
            break;
          case 'no_code':
            errorMessage = 'Invalid authentication request. Please try again.';
            break;
          case 'unexpected_error':
            errorMessage = 'An unexpected error occurred. Please try again.';
            break;
        }

        toast({
          title: 'Authentication Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    }
  }, [toast]);

  const handleSuccessfulLogin = async (loggedInUser: User) => {
    toast({
        title: 'Login Successful!',
        description: `Welcome ${loggedInUser.email || 'back'}!`,
    });
    router.push('/');
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        await handleSuccessfulLogin(data.user);
      }

    } catch (error: any) {
      const errorMessage = handleSupabaseError(error, 'Login failed');
      toast({
        title: 'Login Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      console.log('Starting Google OAuth login...');

      // Check if Supabase is properly configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL ||
          !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
          process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_url_here' ||
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === 'your_supabase_anon_key_here') {
        throw new Error('Supabase is not properly configured. Please check your environment variables.');
      }

      // Use the correct redirect URL for OAuth
      const redirectUrl = `${window.location.origin}/auth/callback`;
      console.log('Using redirect URL:', redirectUrl);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        console.error('Google OAuth error:', error);
        throw error;
      }

      console.log('Google OAuth initiated successfully:', data);

    } catch (error: any) {
      console.error('Google login error:', error);
      const errorMessage = handleSupabaseError(error, 'Google login failed');
      toast({
        title: 'Login Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center" style={{ background: '#0d0d1a' }}>
        <Loader className="w-16 h-16 animate-spin text-purple-500" />
      </div>
    );
  }

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
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold gradient-text mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Welcome Back
            </CardTitle>
            <CardDescription className="text-[var(--text-secondary)]">
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-[var(--text-secondary)] text-sm font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="bg-white/5 border-[var(--glass-border-strong)] text-white placeholder:text-[var(--text-muted)] focus:border-[var(--accent-1)] focus:ring-[var(--accent-1)]/20"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-[var(--text-secondary)] text-sm font-medium">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="bg-white/5 border-[var(--glass-border-strong)] text-white placeholder:text-[var(--text-muted)] focus:border-[var(--accent-1)] focus:ring-[var(--accent-1)]/20"
                  />
                  <div className="text-right">
                    <Link
                      href="/reset-password"
                      className="text-sm text-[var(--accent-1)] hover:text-[var(--accent-3)] transition-colors duration-200"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full btn-primary text-base"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>
              </div>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[var(--glass-border-strong)]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-3 text-[var(--text-muted)] font-medium" style={{ background: 'transparent' }}>
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              type="button"
              className="w-full btn-secondary"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <GoogleIcon className="mr-2 h-4 w-4" />
              )}
              {isLoading ? 'Connecting...' : 'Continue with Google'}
            </Button>

            <div className="mt-4 text-center text-sm">
              <span className="text-[var(--text-muted)]">Don&apos;t have an account? </span>
              <Link href="/register" className="text-[var(--accent-1)] hover:text-[var(--accent-3)] transition-colors duration-200">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
