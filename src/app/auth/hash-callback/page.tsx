'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function HashCallbackPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleHashCallback = async () => {
      try {
        // Get the hash from the URL
        const hash = window.location.hash.substring(1); // Remove the '#'
        
        if (!hash) {
          throw new Error('No hash found in URL');
        }

        // Parse the hash parameters
        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const expiresIn = params.get('expires_in');
        const tokenType = params.get('token_type');

        if (!accessToken) {
          throw new Error('No access token found in hash');
        }

        console.log('Processing hash callback with tokens...');

        // Set the session manually using the tokens from the hash
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        });

        if (error) {
          console.error('Error setting session:', error);
          throw error;
        }

        if (data.user) {
          console.log('Successfully authenticated user:', data.user.email);
          
          // Create or update profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (!profile && !profileError) {
            // Create new profile
            const fullName = data.user.user_metadata.full_name || 
                            data.user.user_metadata.name || 
                            data.user.email?.split('@')[0] || 
                            'Unknown';
            
            const avatarUrl = data.user.user_metadata.avatar_url || 
                             data.user.user_metadata.picture || 
                             null;

            const { error: insertError } = await supabase.from('profiles').insert({
              id: data.user.id,
              full_name: fullName,
              age: data.user.user_metadata.age || null,
              gender: data.user.user_metadata.gender || 'prefer-not-to-say',
              country: data.user.user_metadata.country || 'Unknown',
              use_case: data.user.user_metadata.use_case || 'other',
              avatar_url: avatarUrl,
            });
            
            if (insertError) {
              console.error('Error creating profile:', insertError);
            } else {
              console.log('Profile created successfully for user:', data.user.id);
            }
          }

          toast({
            title: 'Login Successful!',
            description: `Welcome ${data.user.email || 'back'}!`,
          });

          // Redirect to the main app
          router.push('/my-canvases');
        } else {
          throw new Error('No user data received');
        }

      } catch (error: any) {
        console.error('Hash callback error:', error);
        
        toast({
          title: 'Authentication Failed',
          description: error.message || 'Failed to complete authentication',
          variant: 'destructive',
        });

        // Redirect back to login with error
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
        <h2 className="text-xl font-semibold mb-2">Completing Authentication</h2>
        <p className="text-muted-foreground">
          {isProcessing ? 'Processing your login...' : 'Redirecting...'}
        </p>
      </div>
    </div>
  );
} 