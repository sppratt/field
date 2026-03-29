'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getAuthState } from '@/lib/utils/auth';
import { logOut } from '@/lib/db/users';
import styles from '@/app/styles/Navigation.module.css';
import { cn } from '@/app/utils/cn';

export const Navigation = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { user: authUser } = await getAuthState();
      setUser(authUser);
      setLoading(false);
    };

    checkAuth();
  }, []);

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  const handleLogout = async () => {
    const { error } = await logOut();
    if (!error) {
      router.push('/');
    }
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          Field
        </Link>
        <ul className={styles.links}>
          <li>
            <Link
              href="/"
              className={cn(
                styles.link,
                isActive('/') && !isActive('/pathways') && styles.active
              )}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/pathways"
              className={cn(styles.link, isActive('/pathways') && styles.active)}
            >
              Explore Careers
            </Link>
          </li>

          {!loading && (
            <>
              {user ? (
                <>
                  <li>
                    <Link
                      href={user.user_metadata?.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'}
                      className={cn(styles.link, isActive('/dashboard') && styles.active)}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                      Log Out
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/auth/login" className={cn(styles.link, isActive('/auth/login') && styles.active)}>
                      Log In
                    </Link>
                  </li>
                  <li>
                    <Link href="/auth/signup" className={cn(styles.link, isActive('/auth/signup') && styles.active)}>
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};
