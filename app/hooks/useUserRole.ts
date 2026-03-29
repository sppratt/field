'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import { getUser } from '@/lib/db/users';
import type { UserRole } from '@/lib/db/types';

/**
 * Hook to get the current user's role from the database.
 * Returns the role ('student' or 'teacher') or null if not logged in or loading.
 */
export function useUserRole(): UserRole | null {
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setRole(null);
      setLoading(false);
      return;
    }

    const fetchRole = async () => {
      const userProfile = await getUser(user.id);
      setRole(userProfile?.role || null);
      setLoading(false);
    };

    fetchRole();
  }, [user, authLoading]);

  return role;
}
