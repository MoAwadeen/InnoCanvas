
'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, onSnapshot, DocumentData } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  userData: DocumentData | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<DocumentData | null>(null);
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
      let unsubscribeFirestore: (() => void) | undefined;

      if (user) {
          setLoading(true);
          const userDocRef = doc(db, 'users', user.uid);
          unsubscribeFirestore = onSnapshot(userDocRef, (docSnap) => {
              if (docSnap.exists()) {
                  setUserData(docSnap.data());
              } else {
                  setUserData(null); 
              }
              setLoading(false);
          }, (error) => {
              console.error("Error fetching user data:", error);
              setUserData(null);
              setLoading(false);
          });
      } else {
        setLoading(false);
      }

      return () => {
          if (unsubscribeFirestore) {
            unsubscribeFirestore();
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

    