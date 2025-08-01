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
      // Try to sign in to check if email is verified
      const { data, error } = await supabase.auth.signInWithOtp({
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
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-center p-4">
      <div className="absolute top-8 left-8">
        <Logo href="/" />
      </div>
      
      <Card className="mx-auto max-w-md w-full card-glass bg-bright-cyan/20 backdrop-blur-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-xl headline-glow">Verify Your Email</CardTitle>
          <CardDescription>
            Enter your email address to resend verification or get a magic link.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={handleResendVerification} 
              disabled={isResending || !email}
              className="w-full"
              variant="outline"
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
              className="w-full"
              variant="gradient"
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
          
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start space-x-2 p-3 bg-yellow-50 rounded-lg">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800">Troubleshooting Tips:</p>
                <ul className="mt-1 space-y-1 text-yellow-700">
                  <li>• Check your spam/junk folder</li>
                  <li>• Make sure you entered the correct email</li>
                  <li>• Try the magic link option if verification doesn't work</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/login">
                Back to Sign In
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full">
              <Link href="/register">
                Create New Account
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 