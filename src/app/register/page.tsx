
'use client';

import Link from "next/link";
import { unstable_noStore as noStore } from 'next/cache';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReactCountryFlag from "react-country-flag";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { countries } from "@/lib/countries";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Logo } from "@/components/logo";
import { supabase, handleSupabaseError } from "@/lib/supabase";
import { GoogleIcon } from "@/components/ui/google-icon";

export const dynamic = "force-dynamic";

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }).max(50, { message: "Name cannot be longer than 50 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long." })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character." }),
  age: z.coerce.number().int().min(13, { message: "You must be at least 13 years old." }).max(120, { message: "Please enter a valid age." }),
  gender: z.string().min(1, { message: "Please select your gender." }),
  country: z.string().min(1, { message: "Please select your country." }),
  useCase: z.string().min(1, { message: "Please select a use case." }),
});


export default function RegisterPage() {
  // Force dynamic rendering to avoid SSR issues
  noStore();
  
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      age: undefined,
      gender: "",
      country: "",
      useCase: "",
    },
  });
  
  const { isSubmitting } = form.formState;

  useEffect(() => {
    // Redirect if user is already logged in
    if (!authLoading && user) {
        router.push('/my-canvases');
    }
  }, [user, authLoading, router]);


  const handleSignUp = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
            age: values.age,
            gender: values.gender,
            country: values.country,
            use_case: values.useCase,
          },
        },
      });
      
      if (signUpError) throw signUpError;
      if (!signUpData.user) throw new Error("User not created.");

      // Try to create profile manually as fallback (in case trigger fails)
      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: signUpData.user.id,
            full_name: values.fullName,
            age: values.age,
            gender: values.gender,
            country: values.country,
            use_case: values.useCase,
          });
        
        if (profileError) {
          console.warn('Profile creation failed, but user was created:', profileError);
          // Don't throw error here - user was created successfully
        }
      } catch (profileError) {
        console.warn('Manual profile creation failed:', profileError);
        // Don't throw error here - user was created successfully
      }

      // Check if email confirmation is required
      if (signUpData.user && !signUpData.user.email_confirmed_at) {
        toast({
          title: 'Account Created Successfully!',
          description: "Please check your email to verify your account. You'll be able to sign in after email verification.",
        });

        // Redirect to success page
        setTimeout(() => {
          router.push('/register/success');
        }, 2000);
      } else {
        // Email already confirmed or confirmation not required
        toast({
          title: 'Account Created Successfully!',
          description: "Your account has been created and you can now sign in.",
        });

        // Redirect to login
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }

    } catch (error: any) {
      const errorMessage = handleSupabaseError(error, 'Registration failed');
      toast({
        title: 'Registration Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      console.log('Starting Google OAuth signup...');
      
      // Check if Supabase is properly configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || 
          !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
          process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_url_here' ||
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === 'your_supabase_anon_key_here') {
        throw new Error('Supabase is not properly configured. Please check your environment variables.');
      }

      // Use the correct redirect URL - this should be where the user ends up after OAuth
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
        },
      });

      if (error) {
        console.error('Google OAuth error:', error);
        throw error;
      }

      console.log('Google OAuth initiated successfully:', data);
      
    } catch (error: any) {
      console.error('Google signup error:', error);
       const errorMessage = handleSupabaseError(error, 'Google registration failed');
       toast({
        title: 'Registration Failed',
        description: errorMessage,
        variant: 'destructive',
      });
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
          <CardTitle className="text-xl headline-glow">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account. Start your journey with AI-driven strategy.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Max Robinson" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="m@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="25" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="non-binary">Non-binary</SelectItem>
                                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
               </div>
               <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select your country" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <ScrollArea className="h-72">
                              {countries.map((country) => (
                                <SelectItem key={country.code} value={country.name}>
                                  <div className="flex items-center gap-2">
                                    <ReactCountryFlag countryCode={country.code} svg />
                                    <span>{country.name}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </ScrollArea>
                          </SelectContent>
                        </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="useCase"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Use Case</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger><SelectValue placeholder="How will you use InnoCanvas?" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="student">Student</SelectItem>
                                <SelectItem value="entrepreneur">Entrepreneur</SelectItem>
                                <SelectItem value="accelerator">Accelerator</SelectItem>
                                <SelectItem value="consultant">Consultant</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
               <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button variant="gradient" type="submit" className="w-full btn-glow" disabled={isSubmitting}>
                 {isSubmitting ? <Loader className="animate-spin" /> : 'Create an account'}
              </Button>
            </form>
          </Form>
           <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <Button variant="secondary" className="w-full flex items-center justify-center gap-2" onClick={handleGoogleSignUp} disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader className="animate-spin" />
            ) : (
              <>
                <GoogleIcon className="w-5 h-5" />
                <span>Continue with Google</span>
              </>
            )}
          </Button>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline hover:text-vivid-pink">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
