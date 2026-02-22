
'use client';

import Link from "next/link";
import { unstable_noStore as noStore } from 'next/cache';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ReactCountryFlag from "react-country-flag";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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

const inputClass = "bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-[#77ff00]/30 focus-visible:border-[#77ff00]";

export default function RegisterPage() {
  noStore();

  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    length: false, lowercase: false, uppercase: false, number: false, special: false,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { fullName: "", email: "", password: "", age: undefined, gender: "", country: "", useCase: "" },
  });

  const { isSubmitting } = form.formState;
  const password = form.watch("password");

  useEffect(() => {
    if (!authLoading && user) router.push('/');
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
          data: { full_name: values.fullName, age: values.age, gender: values.gender, country: values.country, use_case: values.useCase },
        },
      });
      if (signUpError) throw signUpError;
      if (!signUpData.user) throw new Error("User not created.");

      try {
        await supabase.from('profiles').upsert({
          id: signUpData.user.id, full_name: values.fullName, age: values.age,
          gender: values.gender, country: values.country, use_case: values.useCase,
          email: values.email, plan: 'free',
          preferences: { theme: 'dark', notifications: true, newsletter: true, language: 'en' },
          statistics: { canvases_created: 0, last_login: null, total_exports: 0, favorite_colors: [] },
        }, { onConflict: 'id' });
      } catch (profileError) {
        console.warn('Profile upsert failed, but user was created:', profileError);
      }

      if (signUpData.user && !signUpData.user.email_confirmed_at) {
        toast({ title: 'Account Created!', description: "Please check your email to verify your account." });
        setTimeout(() => router.push('/register/success'), 2000);
      } else {
        toast({ title: 'Account Created!', description: "Your account has been created." });
        setTimeout(() => router.push('/login'), 2000);
      }
    } catch (error: any) {
      toast({ title: 'Registration Failed', description: handleSupabaseError(error, 'Registration failed'), variant: 'destructive' });
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setIsGoogleLoading(true);
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error('Authentication service is not properly configured.');
      }
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback`, queryParams: { access_type: 'offline', prompt: 'consent' } },
      });
      if (error) throw error;
      toast({ title: 'Redirecting to Google...', description: "Please complete the signup process with Google." });
    } catch (error: any) {
      toast({ title: 'Google Signup Failed', description: handleSupabaseError(error, 'Google signup failed'), variant: 'destructive' });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  if (authLoading || user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-black">
        <Loader className="w-8 h-8 animate-spin text-[#77ff00]" />
      </div>
    );
  }

  const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
    <div className="flex items-center gap-2 text-xs">
      {met
        ? <CheckCircle className="w-3 h-3 text-[#77ff00]" />
        : <AlertCircle className="w-3 h-3 text-zinc-600" />}
      <span className={met ? "text-[#77ff00]" : "text-zinc-600"}>{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center p-4 py-12">
      <div className="absolute top-8 left-8">
        <Link href="/" className="text-zinc-100 font-bold tracking-tight text-lg duration-200 hover:text-white">
          InnoCanvas
        </Link>
      </div>

      <div className="w-full max-w-md">
        <div className="border border-zinc-800 rounded-xl p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Create an account</h1>
            <p className="text-sm text-zinc-500 mt-2">Fill in the details below to get started</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-4">
              {/* Full Name */}
              <FormField control={form.control} name="fullName" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-zinc-300">Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} className={inputClass} />
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )} />

              {/* Email */}
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-zinc-300">Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="m@example.com" {...field} className={inputClass} />
                  </FormControl>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )} />

              {/* Age + Gender */}
              <div className="grid grid-cols-2 gap-3">
                <FormField control={form.control} name="age" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-zinc-300">Age</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="25" {...field} className={inputClass} />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )} />
                <FormField control={form.control} name="gender" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-zinc-300">Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className={inputClass}>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="non-binary">Non-binary</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )} />
              </div>

              {/* Country */}
              <FormField control={form.control} name="country" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-zinc-300">Country</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className={inputClass}>
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                      <ScrollArea className="h-64">
                        {countries.map((country) => (
                          <SelectItem key={country.code} value={country.name} className="hover:bg-zinc-800">
                            <div className="flex items-center gap-2">
                              <ReactCountryFlag countryCode={country.code} svg />
                              <span>{country.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )} />

              {/* Use Case */}
              <FormField control={form.control} name="useCase" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-zinc-300">How will you use InnoCanvas?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className={inputClass}>
                        <SelectValue placeholder="Select your use case" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="entrepreneur">Entrepreneur</SelectItem>
                      <SelectItem value="accelerator">Accelerator</SelectItem>
                      <SelectItem value="consultant">Consultant</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )} />

              {/* Password */}
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-zinc-300">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        {...field}
                        className={`${inputClass} pr-10`}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 duration-200"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </FormControl>
                  {password && (
                    <div className="mt-2 p-3 bg-zinc-900 rounded-lg border border-zinc-800 space-y-1.5">
                      <PasswordRequirement met={passwordStrength.length} text="At least 8 characters" />
                      <PasswordRequirement met={passwordStrength.lowercase} text="One lowercase letter" />
                      <PasswordRequirement met={passwordStrength.uppercase} text="One uppercase letter" />
                      <PasswordRequirement met={passwordStrength.number} text="One number" />
                      <PasswordRequirement met={passwordStrength.special} text="One special character" />
                    </div>
                  )}
                  <FormMessage className="text-red-400 text-xs" />
                </FormItem>
              )} />

              <Button
                type="submit"
                className="w-full bg-[#77ff00] hover:bg-[#88ff22] text-black font-semibold rounded-lg duration-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <><Loader className="mr-2 w-4 h-4 animate-spin" />Creating account...</>
                ) : 'Create Account'}
              </Button>
            </form>
          </Form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-black px-2 text-zinc-600">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 duration-200"
            onClick={handleGoogleSignUp}
            disabled={isGoogleLoading || isSubmitting}
          >
            {isGoogleLoading
              ? <><Loader className="mr-2 w-4 h-4 animate-spin" />Connecting...</>
              : <><GoogleIcon className="mr-2 w-4 h-4" />Continue with Google</>}
          </Button>

          <div className="mt-6 text-center text-sm">
            <span className="text-zinc-500">Already have an account? </span>
            <Link href="/login" className="text-[#77ff00] hover:text-[#88ff22] duration-200">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
