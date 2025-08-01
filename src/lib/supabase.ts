
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if we have valid environment variables
const hasValidConfig = supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'your_supabase_url_here' && 
  supabaseAnonKey !== 'your_supabase_anon_key_here';

// Create a mock client for development when env vars are not set
const createMockClient = () => {
  return {
    auth: {
      signUp: async () => ({ error: { message: 'Supabase not configured' } }),
      signInWithPassword: async () => ({ error: { message: 'Supabase not configured' } }),
      signInWithOAuth: async () => ({ error: { message: 'Supabase not configured' } }),
      signOut: async () => ({ error: { message: 'Supabase not configured' } }),
      updateUser: async () => ({ error: { message: 'Supabase not configured' } }),
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: null } }),
    },
    from: () => ({
      select: () => ({ eq: () => ({ single: async () => ({ data: null, error: { message: 'Supabase not configured' } }) }) }),
      insert: () => ({ select: () => ({ single: async () => ({ data: null, error: { message: 'Supabase not configured' } }) }) }),
      update: () => ({ eq: () => ({ error: { message: 'Supabase not configured' } }) }),
      upsert: () => ({ error: { message: 'Supabase not configured' } }),
    }),
    storage: {
      from: () => ({
        upload: async () => ({ error: { message: 'Supabase not configured' } }),
        getPublicUrl: () => ({ data: { publicUrl: null } }),
      }),
    },
  };
};

// Create the actual Supabase client or mock client
export const supabase = hasValidConfig 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : createMockClient();

export const getPublicUrl = (bucket: string, path: string) => {
    if (!path || !path.trim()) return null;
    if (!bucket || !bucket.trim()) return null;
    
    if (!hasValidConfig) {
      console.warn('Supabase not configured - cannot get public URL');
      return null;
    }
    
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

    