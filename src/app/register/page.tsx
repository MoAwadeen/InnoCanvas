
'use client';

import Link from "next/link";
import { unstable_noStore as noStore } from 'next/cache';
import { useEffect, useState } from 'react';
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
import { Loader, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
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
  noStore();

  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
  });

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
  const password = form.watch("password");

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    setPasswordStrength({
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^a-zA-Z0-9]/.test(password),
    });
  }, [password]);

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

      try {
        await supabase
          .from('profiles')
          .insert({
            id: signUpData.user.id,
            full_name: values.fullName,
            age: values.age,
            gender: values.gender,
            country: values.country,
            use_case: values.useCase,
            email: values.email,
            plan: 'free',
            preferences: { theme: 'dark', notifications: true, newsletter: true, language: 'en' },
            statistics: { canvases_created: 0, last_login: null, total_exports: 0, favorite_colors: [] }
          });
      } catch (profileError) {
        console.warn('Manual profile creation failed, but user was created:', profileError);
      }

      if (signUpData.user && !signUpData.user.email_confirmed_at) {
        toast({
          title: 'Account Created Successfully!',
          description: "Please check your email to verify your account. You'll be able to sign in after email verification.",
        });

        setTimeout(() => {
          router.push('/register/success');
        }, 2000);
      } else {
        toast({
          title: 'Account Created Successfully!',
          description: "Your account has been created and you can now sign in.",
        });

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
      setIsGoogleLoading(true);

      // Validate Supabase configuration
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL ||
          !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error('Authentication service is not properly configured.');
      }

      // Use the correct redirect URL for OAuth
      const redirectUrl = `${window.location.origin}/auth/callback`;

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

      // Show success message
      toast({
        title: 'Redirecting to Google...',
        description: "Please complete the signup process with Google.",
      });

    } catch (error: any) {
      console.error('Google signup error:', error);
      const errorMessage = handleSupabaseError(error, 'Google signup failed');
      toast({
        title: 'Google Signup Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  if (authLoading || user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center" style={{ background: '#0d0d1a' }}>
        <div className="flex flex-col items-center space-y-4">
          <Loader className="w-8 h-8 animate-spin text-purple-500" />
          <p className="text-[var(--text-muted)] text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
    <div className="flex items-center gap-2 text-xs">
      {met ? (
        <CheckCircle className="w-3 h-3 text-emerald-400" />
      ) : (
        <AlertCircle className="w-3 h-3 text-[var(--text-muted)]" />
      )}
      <span className={met ? "text-emerald-400" : "text-[var(--text-muted)]"}>{text}</span>
    </div>
  );

  const inputClasses = "bg-white/5 border-[var(--glass-border-strong)] text-white placeholder:text-[var(--text-muted)] focus:border-[var(--accent-1)] focus:ring-[var(--accent-1)]/20";
  const selectTriggerClasses = "bg-white/5 border-[var(--glass-border-strong)] text-white focus:border-[var(--accent-1)] focus:ring-[var(--accent-1)]/20";
  const selectContentClasses = "bg-[#1a1a2e] border-[var(--glass-border-strong)]";

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden" style={{ background: '#0d0d1a' }}>
      {/* Animated background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Logo */}
      <div className="absolute top-8 left-8 z-10">
        <Logo href="/" />
      </div>

      {/* Main content */}
      <div className="w-full max-w-md z-10 fade-in-up my-8">
        <Card className="border-0 glass-strong shadow-2xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold gradient-text mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Create Your Account
            </CardTitle>
            <CardDescription className="text-[var(--text-secondary)]">
              Join thousands of entrepreneurs building better businesses
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-5">
                {/* Full Name */}
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[var(--text-secondary)] text-sm font-medium">Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your full name"
                          {...field}
                          className={inputClasses}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[var(--text-secondary)] text-sm font-medium">Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          {...field}
                          className={inputClasses}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Age and Gender */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[var(--text-secondary)] text-sm font-medium">Age</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="25"
                            {...field}
                            className={inputClasses}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[var(--text-secondary)] text-sm font-medium">Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className={selectTriggerClasses}>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className={selectContentClasses}>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="non-binary">Non-binary</SelectItem>
                            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Country */}
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[var(--text-secondary)] text-sm font-medium">Country</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className={selectTriggerClasses}>
                            <SelectValue placeholder="Select your country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className={selectContentClasses}>
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
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Use Case */}
                <FormField
                  control={form.control}
                  name="useCase"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[var(--text-secondary)] text-sm font-medium">How will you use InnoCanvas?</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className={selectTriggerClasses}>
                            <SelectValue placeholder="Select your use case" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className={selectContentClasses}>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="entrepreneur">Entrepreneur</SelectItem>
                          <SelectItem value="accelerator">Accelerator</SelectItem>
                          <SelectItem value="consultant">Consultant</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[var(--text-secondary)] text-sm font-medium">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a strong password"
                            {...field}
                            className={`${inputClasses} pr-10`}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 text-[var(--text-muted)] hover:text-white"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>

                      {/* Password strength indicator */}
                      {password && (
                        <div className="mt-3 p-3 glass rounded-lg">
                          <p className="text-[var(--text-muted)] text-xs mb-2 font-medium">Password requirements:</p>
                          <div className="space-y-1">
                            <PasswordRequirement met={passwordStrength.length} text="At least 8 characters" />
                            <PasswordRequirement met={passwordStrength.lowercase} text="One lowercase letter" />
                            <PasswordRequirement met={passwordStrength.uppercase} text="One uppercase letter" />
                            <PasswordRequirement met={passwordStrength.number} text="One number" />
                            <PasswordRequirement met={passwordStrength.special} text="One special character" />
                          </div>
                        </div>
                      )}

                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full btn-primary text-base"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Loader className="w-4 h-4 animate-spin" />
                      Creating account...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
            </Form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[var(--glass-border-strong)]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-3 text-[var(--text-muted)] font-medium" style={{ background: 'transparent' }}>Or continue with</span>
              </div>
            </div>

            {/* Google Signup Button */}
            <Button
              type="button"
              className="w-full btn-secondary"
              onClick={handleGoogleSignUp}
              disabled={isGoogleLoading || isSubmitting}
            >
              {isGoogleLoading ? (
                <div className="flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  Connecting to Google...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <GoogleIcon className="w-5 h-5" />
                  <span>Continue with Google</span>
                </div>
              )}
            </Button>

            {/* Sign in link */}
            <div className="text-center pt-4 border-t border-[var(--glass-border)]">
              <p className="text-[var(--text-muted)] text-sm">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-[var(--accent-1)] hover:text-[var(--accent-3)] font-medium transition-colors duration-200"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
