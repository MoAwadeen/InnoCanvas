'use client';

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
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-center p-4">
      <div className="absolute top-8 left-8">
        <Logo href="/" />
      </div>
      
      <Card className="mx-auto max-w-md w-full card-glass bg-bright-cyan/20 backdrop-blur-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-xl headline-glow">Account Created Successfully!</CardTitle>
          <CardDescription>
            Your account has been created. Please verify your email to continue.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
            <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Check Your Email</p>
              <p>We've sent a verification link to your email address. Click the link to verify your account and start using InnoCanvas.</p>
            </div>
          </div>
          
          <div className="space-y-3 text-sm text-muted-foreground">
            <p><strong>What happens next?</strong></p>
            <ul className="space-y-1 ml-4">
              <li>• Check your email inbox (and spam folder)</li>
              <li>• Click the verification link in the email</li>
              <li>• You'll be redirected back to sign in</li>
              <li>• Start creating your Business Model Canvas!</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <Button asChild className="w-full" variant="gradient">
              <Link href="/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full">
              <Link href="/">
                Return to Home
              </Link>
            </Button>
          </div>
          
          <div className="text-center text-xs text-muted-foreground">
            <p>Didn't receive the email? Check your spam folder or</p>
            <Link href="/verify-email" className="text-primary hover:underline">
              resend verification email
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 