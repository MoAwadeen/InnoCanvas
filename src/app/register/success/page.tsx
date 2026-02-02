'use client';

import { useEffect } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Mail, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/logo";

export default function RegisterSuccessPage() {
  useEffect(() => {
    // This ensures the component only renders on the client
  }, []);

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
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full" style={{ background: 'linear-gradient(135deg, #10b981, var(--accent-3))' }}>
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-xl font-bold gradient-text" style={{ fontFamily: "'Playfair Display', serif" }}>
              Account Created Successfully!
            </CardTitle>
            <CardDescription className="text-[var(--text-secondary)]">
              Your account has been created. Please verify your email to continue.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex items-start space-x-3 p-4 glass rounded-lg">
              <Mail className="h-5 w-5 text-[var(--accent-3)] mt-0.5 shrink-0" />
              <div className="text-sm text-[var(--text-secondary)]">
                <p className="font-medium text-white">Check Your Email</p>
                <p>We&apos;ve sent a verification link to your email address. Click the link to verify your account and start using InnoCanvas.</p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-[var(--text-muted)]">
              <p className="text-[var(--text-secondary)] font-medium">What happens next?</p>
              <ul className="space-y-1 ml-4">
                <li>Check your email inbox (and spam folder)</li>
                <li>Click the verification link in the email</li>
                <li>You&apos;ll be redirected back to sign in</li>
                <li>Start creating your Business Model Canvas!</li>
              </ul>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full btn-primary text-base">
                <Link href="/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Sign In
                </Link>
              </Button>

              <Button asChild className="w-full btn-secondary">
                <Link href="/">
                  Return to Home
                </Link>
              </Button>
            </div>

            <div className="text-center text-xs text-[var(--text-muted)]">
              <p>Didn&apos;t receive the email? Check your spam folder or</p>
              <Link href="/verify-email" className="text-[var(--accent-1)] hover:text-[var(--accent-3)] transition-colors duration-200">
                resend verification email
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
