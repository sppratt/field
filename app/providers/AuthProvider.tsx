'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChange } from '@/lib/utils/auth';
import type { User as AuthUser } from '@supabase/supabase-js';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let hasSettledLoading = false;

    // Subscribe to auth changes
    const subscription = onAuthStateChange((authUser) => {
      if (isMounted) {
        setUser(authUser);
        setLoading(false);
        hasSettledLoading = true;
      }
    });

    // Initial check
    const checkAuth = async () => {
      try {
        const { getAuthState } = await import('@/lib/utils/auth');
        const { user: initialUser } = await getAuthState();
        if (isMounted) {
          setUser(initialUser || null);
          setLoading(false);
          hasSettledLoading = true;
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        if (isMounted) {
          setLoading(false);
          hasSettledLoading = true;
        }
      }
    };

    checkAuth();

    // Ensure loading is false after 5 seconds max to prevent infinite loading
    const timeout = setTimeout(() => {
      if (isMounted && !hasSettledLoading) {
        setLoading(false);
      }
    }, 5000);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
