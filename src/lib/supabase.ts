
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if we have valid environment variables
const hasValidConfig = supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'your_supabase_url_here' && 
  supabaseAnonKey !== 'your_supabase_anon_key_here' &&
  supabaseUrl !== 'https://placeholder.supabase.co' &&
  supabaseAnonKey !== 'placeholder_key_for_development';

// Create a mock client for development when env vars are not set
const createMockClient = () => {
  console.warn('Supabase not configured - using mock client for development');
  return {
    auth: {
      signUp: async () => ({ data: { user: null }, error: null }),
      signInWithPassword: async () => ({ data: { user: null }, error: null }),
      signInWithOAuth: async () => ({ data: { user: null }, error: null }),
      signOut: async () => ({ error: null }),
      updateUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: (callback: any) => {
        // Mock subscription
        const subscription = {
          data: { subscription: null },
          unsubscribe: () => {}
        };
        return subscription;
      },
    },
    from: (table: string) => ({
      select: (columns?: string) => ({
        eq: (column: string, value: any) => ({
          single: async () => ({ data: null, error: null }),
          maybeSingle: async () => ({ data: null, error: null }),
        }),
        insert: (data: any) => ({
          select: (columns?: string) => ({
            single: async () => ({ data: null, error: null }),
          }),
        }),
        update: (data: any) => ({
          eq: (column: string, value: any) => ({ error: null }),
        }),
        upsert: (data: any) => ({ error: null }),
      }),
    }),
    storage: {
      from: (bucket: string) => ({
        upload: async (path: string, file: any, options?: any) => ({ error: null }),
        getPublicUrl: (path: string) => ({ data: { publicUrl: null } }),
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

    