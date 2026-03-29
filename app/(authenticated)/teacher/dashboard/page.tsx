'use client';

import { useEffect, useState } from 'react';

// Disable static generation for this page (requires auth)
export const dynamic = 'force-dynamic';
import { useRouter } from 'next/navigation';
import { getCurrentUserProfile } from '@/lib/db/users';
import type { User } from '@/lib/db/types';
import styles from './TeacherDashboard.module.css';
import { Button } from '@/app/components/Button';

export default function TeacherDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const userProfile = await getCurrentUserProfile();
        if (!userProfile) {
          router.push('/auth/login');
          return;
        }

        if (userProfile.role !== 'teacher') {
          router.push('/student/dashboard');
          return;
        }

        setUser(userProfile);
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  if (loading) {
    return (
      <div className={styles.container}>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Welcome, {user?.name}!</h1>
          <p>Manage your classes and track student progress</p>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Your Classes</h2>
          <Button variant="primary">Create Class</Button>
        </div>

        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📚</div>
          <h3>No classes yet</h3>
          <p>Create a class to start tracking your students&apos; progress in Field</p>
          <div className={styles.buttonWrapper}>
            <Button variant="secondary">
              Create Your First Class
            </Button>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Coming Soon</h2>
        <ul className={styles.featureList}>
          <li>View student progress across all pathways</li>
          <li>Export reports and analytics</li>
          <li>Manage class rosters</li>
          <li>Provide feedback to students</li>
        </ul>
      </div>
    </div>
  );
}
