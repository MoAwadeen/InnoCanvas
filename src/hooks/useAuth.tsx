
'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  full_name: string;
  age: number;
  gender: string;
  country: string;
  use_case: string;
  avatar_url?: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    }
    
    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (!currentUser) {
        setUserData(null);
      }
      // setLoading(false) is handled in the userData useEffect
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let unsubscribe: any;

    if (user) {
        setLoading(true);
        
        const fetchUserProfile = async () => {
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
          setLoading(false);
        };
        
        fetchUserProfile();

        const channel = supabase
          .channel(`public:profiles:id=eq.${user.id}`)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}`},
            (payload) => {
              setUserData(payload.new as UserProfile);
            }
          ).subscribe();
          
        unsubscribe = () => {
            supabase.removeChannel(channel);
        };

    } else {
      setUserData(null);
      setLoading(false);
    }

    return () => {
        if (unsubscribe) {
          unsubscribe();
        }
    };
  }, [user]);

  const value = { user, userData, loading };

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
