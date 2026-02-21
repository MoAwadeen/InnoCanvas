'use client';

import { useEffect } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Mail, ArrowLeft } from "lucide-react";

export default function RegisterSuccessPage() {
  useEffect(() => {}, []);

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
            <CheckCircle className="h-6 w-6 text-[#77ff00]" />
          </div>

          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight mb-2">Account Created!</h1>
          <p className="text-sm text-zinc-500 mb-8">
            Your account has been created. Please verify your email to continue.
          </p>

          <div className="flex items-start gap-3 p-4 bg-zinc-900 rounded-lg border border-zinc-800 text-left mb-6">
            <Mail className="h-5 w-5 text-[#77ff00] mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-zinc-200 mb-1">Check Your Email</p>
              <p className="text-zinc-500 text-xs leading-relaxed">
                We&apos;ve sent a verification link to your email. Click the link to verify your account and start using InnoCanvas.
              </p>
            </div>
          </div>

          <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800 text-left mb-6">
            <p className="text-xs font-medium text-zinc-400 mb-2">What happens next?</p>
            <ul className="space-y-1 text-xs text-zinc-500">
              <li>• Check your email inbox (and spam folder)</li>
              <li>• Click the verification link in the email</li>
              <li>• You&apos;ll be redirected back to sign in</li>
              <li>• Start creating your Business Model Canvas!</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full bg-[#77ff00] hover:bg-[#88ff22] text-black font-semibold rounded-lg duration-200">
              <Link href="/login">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sign In
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 duration-200">
              <Link href="/">Return to Home</Link>
            </Button>
          </div>

          <p className="mt-6 text-xs text-zinc-600">
            Didn&apos;t receive the email?{" "}
            <Link href="/verify-email" className="text-[#77ff00] hover:text-[#88ff22] duration-200">
              Resend verification email
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
