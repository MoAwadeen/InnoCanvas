
'use client';

import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { PlanService, PlanLimits } from '@/lib/plan-service';

export interface UserProfile {
  id: string;
  full_name: string;
  age: number | null;
  gender: string;
  country: string;
  use_case: string;
  avatar_url: string | null;
  email: string;
  phone: string | null;
  company: string | null;
  job_title: string | null;
  industry: string | null;
  experience_level: string | null;
  plan: 'free' | 'pro' | 'premium';
  plan_expiry: string | null;
  subscription_id: string | null;
  payment_provider: string;
  preferences: {
    theme: string;
    notifications: boolean;
    newsletter: boolean;
    language: string;
  } | null;
  statistics: {
    canvases_created: number;
    last_login: string;
    total_exports: number;
    favorite_colors: string[];
  } | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserProfile | null;
  loading: boolean;
  fetchUserProfile: () => Promise<void>;
  checkPlanLimit: (action: string) => Promise<boolean>;
  getPlanLimits: () => Promise<PlanLimits | null>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  fetchUserProfile: async () => { },
  checkPlanLimit: async () => false,
  getPlanLimits: async () => null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async () => {
    if (user) {
      if (process.env.NODE_ENV === 'development' && user.id === '00000000-0000-0000-0000-000000000000') {
        setUserData({
          id: user.id,
          full_name: 'Dev User',
          email: user.email || 'dev@innocanvas.site',
          age: 30,
          gender: 'other',
          country: 'Devland',
          use_case: 'testing',
          avatar_url: null,
          phone: null,
          company: 'InnoCanvas Dev',
          job_title: 'Developer',
          industry: 'Technology',
          experience_level: 'expert',
          plan: 'premium',
          plan_expiry: null,
          subscription_id: 'sub_dev',
          payment_provider: 'mock',
          role: 'admin',
          preferences: { theme: 'dark', notifications: true, newsletter: true, language: 'en' },
          statistics: { canvases_created: 5, last_login: new Date().toISOString(), total_exports: 10, favorite_colors: ['#30A2FF'] },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as any);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116: "object not found"
          console.error("Error fetching user data:", error);
          setUserData(null);
        } else if (data) {
          setUserData(data);
        } else {
          // Profile doesn't exist, create it
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              full_name: user.user_metadata.full_name ||
                user.user_metadata.name ||
                user.email?.split('@')[0] ||
                'Unknown',
              avatar_url: user.user_metadata.avatar_url ||
                user.user_metadata.picture ||
                null,
              email: user.email || '',
              age: null,
              gender: 'prefer-not-to-say',
              country: 'Unknown',
              use_case: 'other',
              plan: 'free',
              preferences: { theme: 'dark', notifications: true, newsletter: true, language: 'en' },
              statistics: { canvases_created: 0, last_login: null, total_exports: 0, favorite_colors: [] }
            })
            .select()
            .single();

          if (createError) {
            console.error("Error creating profile:", createError);
            setUserData(null);
          } else {
            setUserData(newProfile);
          }
        }
      } catch (error) {
        console.error("Error in fetchUserProfile:", error);
        setUserData(null);
      }
    }
  }, [user]);

  const checkPlanLimit = useCallback(async (action: string): Promise<boolean> => {
    if (!user) return false;
    return await PlanService.checkPlanLimit(user.id, action);
  }, [user]);

  const getPlanLimits = useCallback(async (): Promise<PlanLimits | null> => {
    if (!userData?.plan) return null;
    return await PlanService.getPlanLimits(userData.plan);
  }, [userData?.plan]);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error fetching session:", error);
          if (process.env.NODE_ENV === 'development') {
            const mockUser: User = {
              id: '00000000-0000-0000-0000-000000000000',
              email: 'dev@innocanvas.site',
              app_metadata: {},
              user_metadata: { full_name: 'Dev User' },
              aud: 'authenticated',
              created_at: new Date().toISOString()
            } as User;
            setUser(mockUser);
            setLoading(false);
            return;
          }
          setLoading(false);
          return;
        }

        if (!session?.user && process.env.NODE_ENV === 'development') {
          const mockUser: User = {
            id: '00000000-0000-0000-0000-000000000000',
            email: 'dev@innocanvas.site',
            app_metadata: {},
            user_metadata: { full_name: 'Dev User' },
            aud: 'authenticated',
            created_at: new Date().toISOString()
          } as User;
          setUser(mockUser);
        } else {
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error("Error in fetchSession:", error);
        setLoading(false);
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      const currentUser = session?.user || null;
      setUser(currentUser);

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (currentUser) {
          // Fetch user profile when user signs in
          setLoading(true);
          try {
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', currentUser.id)
              .single();

            if (error && error.code !== 'PGRST116') {
              console.error("Error fetching profile on sign in:", error);
              setUserData(null);
            } else if (profile) {
              setUserData(profile);
            } else {
              // Create profile if it doesn't exist
              const { data: newProfile, error: createError } = await supabase
                .from('profiles')
                .insert({
                  id: currentUser.id,
                  full_name: currentUser.user_metadata.full_name ||
                    currentUser.user_metadata.name ||
                    currentUser.email?.split('@')[0] ||
                    'Unknown',
                  avatar_url: currentUser.user_metadata.avatar_url ||
                    currentUser.user_metadata.picture ||
                    null,
                  email: currentUser.email || '',
                  age: null,
                  gender: 'prefer-not-to-say',
                  country: 'Unknown',
                  use_case: 'other',
                  plan: 'free',
                  preferences: { theme: 'dark', notifications: true, newsletter: true, language: 'en' },
                  statistics: { canvases_created: 0, last_login: null, total_exports: 0, favorite_colors: [] }
                })
                .select()
                .single();

              if (createError) {
                console.error("Error creating profile on sign in:", createError);
                setUserData(null);
              } else {
                setUserData(newProfile);
              }
            }
          } catch (error) {
            console.error("Error in auth state change profile fetch:", error);
            setUserData(null);
          } finally {
            setLoading(false);
          }
        }
      } else if (event === 'USER_UPDATED') {
        if (currentUser) {
          setUserData(prev => prev ? { ...prev, full_name: currentUser.user_metadata.full_name } : null);
        }
      } else if (event === 'SIGNED_OUT') {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    if (user && !userData) {
      setLoading(true);
      fetchUserProfile().finally(() => setLoading(false));
    } else if (!user) {
      setUserData(null);
      setLoading(false);
    }
  }, [user, userData, fetchUserProfile]);

  const value = { user, userData, loading, fetchUserProfile, checkPlanLimit, getPlanLimits };

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

