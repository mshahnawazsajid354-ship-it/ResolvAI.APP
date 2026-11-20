import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../services/supabaseClient';

interface AuthContextType {
  user: User | null;
  displayName: string;
  email: string;
  loading: boolean;
  isConfigured: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  displayName: '',
  email: '',
  loading: false,
  isConfigured: false,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(supabase !== null);
  const isConfigured = supabase !== null;

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted) {
        setUser(session?.user ?? null);
        setLoading(false);
        if (!session?.user) {
          try {
            sessionStorage.removeItem('product_one_auth_pending');
          } catch {}
        }
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    if (!supabase) return;
    try {
      sessionStorage.setItem('product_one_auth_pending', '1');
    } catch {}
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) {
        try {
          sessionStorage.removeItem('product_one_auth_pending');
        } catch {}
      }
    } catch (err) {
      try {
        sessionStorage.removeItem('product_one_auth_pending');
      } catch {}
      console.error('Error signing in with Google:', err);
    }
  };

  const signOut = async () => {
    if (!supabase) return;
    try {
      try {
        sessionStorage.removeItem('product_one_auth_pending');
      } catch {}
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  const displayName =
    (user?.user_metadata?.full_name as string) ||
    (user?.user_metadata?.name as string) ||
    (user?.email ? user.email.split('@')[0] : '') ||
    '';

  const email = user?.email || '';

  return (
    <AuthContext.Provider
      value={{
        user,
        displayName,
        email,
        loading,
        isConfigured,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
