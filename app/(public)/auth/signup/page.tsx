'use client';

import { useState, Suspense } from 'react';

export const dynamic = 'force-dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signUp } from '@/lib/db/users';
import { updateUserProfile } from '@/lib/db/profile';
import type { UserRole } from '@/lib/db/types';
import styles from './SignUp.module.css';
import { Button } from '@/app/components/Button';

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');

  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student' as UserRole,
    interests: '',
    goals: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError(null);
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setError(null);
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { user, error: signUpError } = await signUp({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    });

    if (signUpError) {
      setError(signUpError);
      setLoading(false);
      return;
    }

    if (user) {
      // Save interests and goals
      if (formData.interests || formData.goals) {
        const profileData = `${formData.interests}${formData.interests && formData.goals ? ' | ' : ''}${formData.goals}`;
        await updateUserProfile(user.id, {
          interests: profileData,
        });
      }

      setLoading(false);

      // Redirect to appropriate dashboard
      if (redirectParam) {
        router.push(redirectParam);
      } else {
        if (user.role === 'teacher') {
          router.push('/teacher/dashboard');
        } else {
          router.push('/student/dashboard');
        }
      }
    } else {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1>Create Your Account</h1>
          <p>Join Field to explore careers and track your progress</p>
          <div className={styles.progressBar}>
            <div className={styles.progress} style={{ width: `${(step / 2) * 100}%` }} />
          </div>
          <p className={styles.stepIndicator}>Step {step} of 2</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          {step === 1 ? (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Alex Johnson"
                  required
                />
              </div>

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
                  placeholder="At least 8 characters"
                  required
                />
                <p className={styles.hint}>At least 8 characters recommended</p>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="role">I&apos;m a:</label>
                <select id="role" name="role" value={formData.role} onChange={handleChange}>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
              </div>

              <Button type="button" variant="primary" fullWidth onClick={handleNext}>
                Next
              </Button>
            </>
          ) : (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="interests">What career fields interest you?</label>
                <textarea
                  id="interests"
                  name="interests"
                  value={formData.interests}
                  onChange={handleChange}
                  placeholder="e.g., Technology, Healthcare, Creative Arts..."
                  rows={3}
                />
                <p className={styles.hint}>This helps us recommend relevant career pathways</p>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="goals">What are your goals with Field?</label>
                <textarea
                  id="goals"
                  name="goals"
                  value={formData.goals}
                  onChange={handleChange}
                  placeholder="e.g., Explore different careers, find my passion, understand job requirements..."
                  rows={3}
                />
                <p className={styles.hint}>Let us know what you hope to achieve</p>
              </div>

              <div className={styles.formActions}>
                <Button type="button" variant="secondary" onClick={handleBack} disabled={loading}>
                  Back
                </Button>
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </div>
            </>
          )}
        </form>

        <div className={styles.footer}>
          <p>
            Already have an account?{' '}
            <Link href="/auth/login" className={styles.link}>
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className={styles.container}>Loading...</div>}>
      <SignUpForm />
    </Suspense>
  );
}
