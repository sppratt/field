'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/app/components/Layout';
import { getAuthState } from '@/lib/utils/auth';

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { user } = await getAuthState();
      if (!user) {
        router.push('/auth/login');
      } else {
        setIsAuthenticated(true);
      }
    };

    checkAuth();
  }, [router]);

  if (isAuthenticated === null) {
    return <Layout>Loading...</Layout>;
  }

  return <Layout>{children}</Layout>;
}
