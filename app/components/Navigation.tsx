'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import PersonIcon from '@mui/icons-material/Person';
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
        <Link href={user ? dashboardHref : "/"} className={styles.logo}>
          <Image
            src="/field_logo.svg"
            alt="Field"
            width={105}
            height={40}
          />
        </Link>
        <ul className={styles.links}>
          {!user && (
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
          )}
          <li>
            <Link
              href="/pathways"
              className={cn(styles.link, isActive('/pathways') && styles.active)}
            >
              Explore Fields
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
                  <li className={styles.profileContainer}>
                    <button className={styles.profileButton} title="Profile menu">
                      <PersonIcon sx={{ width: 24, height: 24 }} />
                    </button>
                    <div className={styles.profileDropdown}>
                      <Link href="/profile" className={styles.dropdownItem}>
                        Profile Settings
                      </Link>
                      <button onClick={handleLogout} className={styles.dropdownItem}>
                        Log Out
                      </button>
                    </div>
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
