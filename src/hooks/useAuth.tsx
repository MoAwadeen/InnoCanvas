
'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Loader } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  userData: any | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      if (!authUser) {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
      let unsubscribeFirestore: () => void;

      if (user) {
          const userDocRef = doc(db, 'users', user.uid);
          unsubscribeFirestore = onSnapshot(userDocRef, (doc) => {
              if (doc.exists()) {
                  setUserData(doc.data());
              } else {
                  // This case can happen briefly if the user document hasn't been created yet
                  setUserData(null); 
              }
              setLoading(false);
          }, (error) => {
              console.error("Error fetching user data:", error);
              setLoading(false);
          });
      } else {
        // No user, not loading
        setLoading(false);
      }

      return () => {
          if (unsubscribeFirestore) {
            unsubscribeFirestore();
          }
      };
  }, [user]);


  if (loading) {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background">
            <Loader className="w-16 h-16 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
