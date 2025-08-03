
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
    router.push('/my-canvases');
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
      console.log('Current origin:', window.location.origin);
      console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
      
      // Check if Supabase is properly configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || 
          !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
          process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_url_here' ||
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === 'your_supabase_anon_key_here') {
        throw new Error('Supabase is not properly configured. Please check your environment variables.');
      }

      // Force the correct redirect URL
      const redirectUrl = 'https://ewetzmzfbwnqsdoikykz.supabase.co/auth/v1/callback';
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
      
      // Check if the URL contains localhost
      if (data && 'url' in data && typeof data.url === 'string' && data.url.includes('localhost')) {
        console.error('WARNING: OAuth URL still contains localhost!');
        console.error('Full OAuth URL:', data.url);
        throw new Error('OAuth configuration still has localhost redirect. Please check Google OAuth and Supabase settings.');
      }

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
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <Loader className="w-16 h-16 animate-spin text-primary" />
      </div>
    );
  }


  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-center p-4">
      <div className="absolute top-8 left-8">
        <Logo href="/" />
      </div>
      <Card className="mx-auto max-w-md w-full card-glass bg-bright-cyan/20 backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="text-2xl headline-glow">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button variant="gradient" type="submit" className="w-full btn-glow" disabled={isLoading}>
                {isLoading ? <Loader className="animate-spin" /> : 'Login'}
              </Button>
            </div>
          </form>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
           <Button variant="secondary" className="w-full flex items-center justify-center gap-2" onClick={handleGoogleLogin} disabled={isLoading}>
              {isLoading ? (
                <Loader className="animate-spin" />
              ) : (
                <>
                  <GoogleIcon className="w-5 h-5" />
                  <span>Continue with Google</span>
                </>
              )}
            </Button>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline hover:text-vivid-pink">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
