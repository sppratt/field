'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/providers/AuthProvider';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * AuthGuard component that redirects unauthenticated users to login.
 * Preserves the intended destination in the 'redirect' query parameter.
 */
export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      // Get the current URL to redirect back after login
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
      router.push(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [user, loading, router]);

  if (loading) {
    return fallback || <div>Loading...</div>;
  }

  if (!user) {
    return fallback || null;
  }

  return <>{children}</>;
}
