
'use client';

import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  full_name: string;
  age: number | null;
  gender: string;
  country: string;
  use_case: string;
  avatar_url: string | null;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserProfile | null;
  loading: boolean;
  fetchUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  fetchUserProfile: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async () => {
    if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116: "object not found"
          console.error("Error fetching user data:", error);
          setUserData(null);
        } else {
          setUserData(data);
        }
    }
  }, [user]);


  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
       if (error) {
        console.error("Error fetching session:", error)
        setLoading(false);
        return;
      }
      setUser(session?.user ?? null);
      // Loading will be set to false after user data is fetched or confirmed absent
    };
    
    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (event === 'USER_UPDATED') {
          if(currentUser) {
              setUserData(prev => prev ? {...prev, full_name: currentUser.user_metadata.full_name} : null);
          }
      }
      if (event === 'SIGNED_OUT') {
        setUserData(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
        setLoading(true);
        fetchUserProfile().finally(() => setLoading(false));
    } else {
      setUserData(null);
      setLoading(false);
    }
  }, [user, fetchUserProfile]);

  const value = { user, userData, loading, fetchUserProfile };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

    