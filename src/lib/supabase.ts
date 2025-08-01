
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Only throw error in client-side or when actually using the client
if (typeof window !== 'undefined' && (!supabaseUrl || !supabaseAnonKey)) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder', {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export const getPublicUrl = (bucket: string, path: string) => {
    if (!path || !path.trim()) return null;
    if (!bucket || !bucket.trim()) return null;
    
    try {
        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        return data?.publicUrl || null;
    } catch (error) {
        console.error('Error getting public URL:', error);
        return null;
    }
};

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any, defaultMessage: string = 'An error occurred') => {
  console.error('Supabase error:', error);
  
  if (error?.message) {
    return error.message;
  }
  
  if (error?.code) {
    switch (error.code) {
      case 'PGRST116':
        return 'Record not found';
      case '23505':
        return 'This record already exists';
      case '42P01':
        return 'Table does not exist';
      default:
        return defaultMessage;
    }
  }
  
  return defaultMessage;
};

    