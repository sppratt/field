'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers/AuthProvider';
import { useUserRole } from '@/app/hooks/useUserRole';
import { logOut } from '@/lib/db/users';
import styles from '@/app/styles/Navigation.module.css';
import { cn } from '@/app/utils/cn';

export const Navigation = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const role = useUserRole();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  const dashboardHref = role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard';

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
                      href={dashboardHref}
                      className={cn(
                        styles.link,
                        (isActive('/teacher/dashboard') || isActive('/student/dashboard')) && styles.active
                      )}
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
