'use client';

import { useState, useRef, useEffect } from 'react';
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);

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

  const handleProfileKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsDropdownOpen(!isDropdownOpen);
    } else if (e.key === 'Escape' && isDropdownOpen) {
      setIsDropdownOpen(false);
      profileButtonRef.current?.focus();
    } else if (e.key === 'ArrowDown' && isDropdownOpen) {
      e.preventDefault();
      const firstItem = dropdownRef.current?.querySelector('a, button');
      (firstItem as HTMLElement)?.focus();
    }
  };

  const handleDropdownKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      profileButtonRef.current?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const items = Array.from(dropdownRef.current?.querySelectorAll('a, button') || []);
      const currentIndex = items.indexOf(e.currentTarget as HTMLElement);
      if (currentIndex > 0) {
        (items[currentIndex - 1] as HTMLElement)?.focus();
      } else {
        profileButtonRef.current?.focus();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const items = Array.from(dropdownRef.current?.querySelectorAll('a, button') || []);
      const currentIndex = items.indexOf(e.currentTarget as HTMLElement);
      if (currentIndex < items.length - 1) {
        (items[currentIndex + 1] as HTMLElement)?.focus();
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        profileButtonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !profileButtonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isDropdownOpen]);

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
          {role !== 'teacher' && (
            <li>
              <Link
                href="/pathways"
                className={cn(styles.link, isActive('/pathways') && styles.active)}
              >
                Explore Fields
              </Link>
            </li>
          )}

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
                    <button
                      ref={profileButtonRef}
                      className={styles.profileButton}
                      title="Profile menu"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      onKeyDown={handleProfileKeyDown}
                      aria-label="Profile menu"
                      aria-expanded={isDropdownOpen}
                      aria-haspopup="menu"
                    >
                      <PersonIcon sx={{ width: 24, height: 24 }} />
                    </button>
                    {isDropdownOpen && (
                      <div
                        ref={dropdownRef}
                        className={styles.profileDropdown}
                        role="menu"
                        aria-label="Profile options"
                      >
                        <Link
                          href="/profile"
                          className={styles.dropdownItem}
                          onKeyDown={handleDropdownKeyDown}
                          role="menuitem"
                        >
                          Profile Settings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className={styles.dropdownItem}
                          onKeyDown={handleDropdownKeyDown}
                          role="menuitem"
                        >
                          Log Out
                        </button>
                      </div>
                    )}
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
