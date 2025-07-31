
'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/lib/supabase'; // Import Supabase client
import { User } from '@supabase/supabase-js'; // Import Supabase User type

// We will address userData later after migrating the database
// import { doc, onSnapshot, DocumentData } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  userData: any; // Keep this as any for now
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null); // Keep this as any for now
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // We will address userData fetching later after migrating the database
  // useEffect(() => {
  //     let unsubscribeFirestore: (() => void) | undefined;

  //     if (user) {
  //         setLoading(true);
  //         const userDocRef = doc(db, 'users', user.uid);
  //         unsubscribeFirestore = onSnapshot(userDocRef, (docSnap) => {
  //             if (docSnap.exists()) {
  //                 setUserData(docSnap.data());
  //             } else {
  //                 setUserData(null); 
  //             }
  //             setLoading(false);
  //         }, (error) => {
  //             console.error("Error fetching user data:", error);
  //             setUserData(null);
  //             setLoading(false);
  //         });
  //     } else {
  //       setLoading(false);
  //     }

  //     return () => {
  //         if (unsubscribeFirestore) {
  //           unsubscribeFirestore();
  //         }
  //     };
  // }, [user]);

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

