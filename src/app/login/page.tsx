
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
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from "@/hooks/useAuth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Logo } from "@/components/logo";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    // Redirect if user is already logged in
    if (!authLoading && user) {
        router.push('/my-canvases');
    }
  }, [user, authLoading, router]);

  const handleSuccessfulLogin = async (user: User) => {
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    let userData = userDoc.exists() ? userDoc.data() : null;
    
    // Create user doc if it doesn't exist (e.g. first Google login)
    if (!userData) {
      const newUserdata = {
          uid: user.uid,
          fullName: user.displayName,
          email: user.email,
          createdAt: new Date(),
          age: '',
          gender: '',
          country: '',
          useCase: '',
      }
      await setDoc(userDocRef, newUserdata);
      userData = newUserdata;
    }

    toast({
        title: 'Login Successful!',
        description: `Welcome ${user.displayName || 'back'}!`,
    });

    if (!userData.age || !userData.country || !userData.useCase) {
        toast({
            title: 'Complete Your Profile',
            description: "Please fill in your details to continue.",
        });
        router.push('/profile');
    } else {
        router.push('/my-canvases');
    }
  }


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await handleSuccessfulLogin(userCredential.user);
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await handleSuccessfulLogin(result.user);
    } catch (error: any) {
       toast({
        title: 'Login Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // If loading or already logged in, show a loader to prevent form flash
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
                  <Link href="/forgot-password" className="ml-auto inline-block text-sm underline hover:text-vivid-pink">
                    Forgot your password?
                  </Link>
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
           <Button variant="secondary" className="w-full" onClick={handleGoogleLogin} disabled={isLoading}>
              {isLoading ? <Loader className="animate-spin" /> : 'Login with Google'}
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
