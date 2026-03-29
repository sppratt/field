'use client';

import { useEffect, useState } from 'react';

// Disable static generation for this page (requires auth)
export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCurrentUserProfile } from '@/lib/db/users';
import { getUserProgress, getProgressSummary } from '@/lib/db/progress';
import { careers } from '@/app/data/careers';
import type { User, StudentProgress } from '@/lib/db/types';
import styles from './StudentDashboard.module.css';

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<StudentProgress[]>([]);
  const [summary, setSummary] = useState({ notStarted: 0, inProgress: 0, completed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const userProfile = await getCurrentUserProfile();
        if (!userProfile) {
          router.push('/auth/login');
          return;
        }

        setUser(userProfile);

        const userProgress = await getUserProgress(userProfile.id);
        setProgress(userProgress);

        const summaryData = await getProgressSummary(userProfile.id);
        setSummary(summaryData);
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  const getProgressStatus = (careerTitle: string) => {
    const careerProgress = progress.find((p) => p.pathway_id === careerTitle.toLowerCase());
    return careerProgress?.status || 'not_started';
  };

  const getProgressPercentage = (careerTitle: string) => {
    const careerProgress = progress.find((p) => p.pathway_id === careerTitle.toLowerCase());
    return careerProgress?.completion_percentage || 0;
  };

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
          <p>Continue exploring careers and tracking your progress</p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{summary.notStarted}</div>
          <div className={styles.statLabel}>Not Started</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{summary.inProgress}</div>
          <div className={styles.statLabel}>In Progress</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{summary.completed}</div>
          <div className={styles.statLabel}>Completed</div>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Your Career Pathways</h2>
        <div className={styles.pathwaysGrid}>
          {careers.map((career) => {
            const status = getProgressStatus(career.id);
            const percentage = getProgressPercentage(career.id);

            return (
              <Link
                key={career.id}
                href={`/pathways/${career.id}`}
                className={styles.pathwayCard}
              >
                <div className={styles.cardHeader}>
                  <h3>{career.title}</h3>
                  <span className={`${styles.badge} ${styles[`badge-${status}`]}`}>
                    {status === 'not_started' && 'Start'}
                    {status === 'in_progress' && 'Continue'}
                    {status === 'completed' && 'Review'}
                  </span>
                </div>

                <p className={styles.description}>{career.description}</p>

                {status !== 'not_started' && (
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                )}

                <div className={styles.cardFooter}>
                  {status === 'not_started' && <span>Ready to explore</span>}
                  {status === 'in_progress' && <span>{percentage}% complete</span>}
                  {status === 'completed' && <span>Completed ✓</span>}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
