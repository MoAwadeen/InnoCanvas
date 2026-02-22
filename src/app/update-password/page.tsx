'use client';

import Link from "next/link";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader, CheckCircle, AlertCircle, Eye, EyeOff, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase, handleSupabaseError } from "@/lib/supabase";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const [passwordStrength, setPasswordStrength] = useState({
    length: false, lowercase: false, uppercase: false, number: false, special: false,
  });

  useEffect(() => {
    setPasswordStrength({
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^a-zA-Z0-9]/.test(password),
    });
  }, [password]);

  const allRequirementsMet = Object.values(passwordStrength).every(Boolean);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!allRequirementsMet) {
      setError('Password does not meet all requirements.');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: 'Password Updated',
        description: 'Your password has been successfully updated.',
      });

      setTimeout(() => router.push('/login'), 3000);
    } catch (error: any) {
      const errorMessage = handleSupabaseError(error, 'Failed to update password');
      setError(errorMessage);
      toast({
        title: 'Update Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
    <div className="flex items-center gap-2 text-xs">
      {met
        ? <CheckCircle className="w-3 h-3 text-[#77ff00]" />
        : <AlertCircle className="w-3 h-3 text-zinc-600" />}
      <span className={met ? "text-[#77ff00]" : "text-zinc-600"}>{text}</span>
    </div>
  );

  if (isSuccess) {
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
            <h1 className="text-2xl font-bold text-zinc-100 tracking-tight mb-2">Password Updated!</h1>
            <p className="text-sm text-zinc-500 mb-6">
              Your password has been successfully updated. Redirecting you to the login page...
            </p>
            <Link href="/login">
              <Button className="w-full bg-[#77ff00] hover:bg-[#88ff22] text-black font-semibold rounded-lg duration-200">
                Go to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center p-4">
      <div className="absolute top-8 left-8">
        <Link href="/" className="text-zinc-100 font-bold tracking-tight text-lg duration-200 hover:text-white">
          InnoCanvas
        </Link>
      </div>

      <div className="w-full max-w-md">
        <div className="border border-zinc-800 rounded-xl p-8">
          <div className="mb-8">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#77ff00]/10 border border-[#77ff00]/20">
              <Lock className="h-6 w-6 text-[#77ff00]" />
            </div>
            <h1 className="text-2xl font-bold text-zinc-100 tracking-tight text-center">Set New Password</h1>
            <p className="text-sm text-zinc-500 mt-2 text-center">Enter your new password below</p>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-zinc-300">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-[#77ff00]/30 focus-visible:border-[#77ff00] pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {password && (
                <div className="mt-2 p-3 bg-zinc-900 rounded-lg border border-zinc-800 space-y-1.5">
                  <PasswordRequirement met={passwordStrength.length} text="At least 8 characters" />
                  <PasswordRequirement met={passwordStrength.lowercase} text="One lowercase letter" />
                  <PasswordRequirement met={passwordStrength.uppercase} text="One uppercase letter" />
                  <PasswordRequirement met={passwordStrength.number} text="One number" />
                  <PasswordRequirement met={passwordStrength.special} text="One special character" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm text-zinc-300">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-[#77ff00]/30 focus-visible:border-[#77ff00]"
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Passwords do not match
                </p>
              )}
              {confirmPassword && password === confirmPassword && password.length > 0 && (
                <p className="text-xs text-[#77ff00] flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Passwords match
                </p>
              )}
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-[#77ff00] hover:bg-[#88ff22] text-black font-semibold rounded-lg duration-200"
              disabled={isLoading || !allRequirementsMet || password !== confirmPassword}
            >
              {isLoading ? (
                <><Loader className="mr-2 w-4 h-4 animate-spin" />Updating...</>
              ) : 'Update Password'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm text-zinc-500 hover:text-zinc-300 duration-200"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
