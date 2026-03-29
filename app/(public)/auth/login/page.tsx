'use client';

import { useState } from 'react';

export const dynamic = 'force-dynamic';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { logIn } from '@/lib/db/users';
import { getCurrentUserProfile } from '@/lib/db/users';
import styles from './LogIn.module.css';
import { Button } from '@/app/components/Button';

export default function LogInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!formData.email.trim()) {
      setError('Please enter your email');
      setLoading(false);
      return;
    }

    if (!formData.password) {
      setError('Please enter your password');
      setLoading(false);
      return;
    }

    const { error: logInError } = await logIn({
      email: formData.email,
      password: formData.password,
    });

    setLoading(false);

    if (logInError) {
      setError('Invalid email or password');
      return;
    }

    // Get user profile to determine role
    const user = await getCurrentUserProfile();

    if (user) {
      // Redirect to appropriate dashboard
      if (user.role === 'teacher') {
        router.push('/teacher/dashboard');
      } else {
        router.push('/student/dashboard');
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1>Welcome Back</h1>
          <p>Log in to continue your career exploration</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Your password"
              required
            />
          </div>

          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </Button>
        </form>

        <div className={styles.footer}>
          <p>
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className={styles.link}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
