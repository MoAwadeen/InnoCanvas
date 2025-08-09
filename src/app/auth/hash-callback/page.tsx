'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Loader } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function HashCallbackPage() {
  const [isProcessing, setIsProcessing] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const handleHashCallback = async () => {
      try {
        // Get the hash from the URL
        const hash = window.location.hash;
        
        if (!hash || !hash.includes('access_token')) {
          console.error('No access token found in hash');
          router.push('/login?error=hash_callback_failed');
          return;
        }

        console.log('Processing hash callback with tokens...');

        // For hash-based OAuth, the tokens are already in the URL
        // We need to let Supabase handle this automatically
        // The auth context should pick up the session automatically
        
        // Wait a moment for the session to be processed
        setTimeout(() => {
          toast({
            title: 'Login Successful!',
            description: 'Welcome back! Redirecting to your dashboard...',
          });
          
          // Redirect to the intended destination
          router.push('/my-canvases');
        }, 1000);

      } catch (error) {
        console.error('Error processing hash callback:', error);
        router.push('/login?error=hash_callback_failed');
      } finally {
        setIsProcessing(false);
      }
    };

    handleHashCallback();
  }, [router, toast]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
        <p className="text-lg font-medium">Processing authentication...</p>
        <p className="text-sm text-muted-foreground mt-2">Please wait while we complete your login.</p>
      </div>
    </div>
  );
} 