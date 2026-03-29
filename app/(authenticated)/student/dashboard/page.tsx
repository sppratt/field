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
import { Button } from '@/app/components/Button';

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<StudentProgress[]>([]);
  const [summary, setSummary] = useState({ notStarted: 0, inProgress: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [classCode, setClassCode] = useState('');
  const [enrolledClass, setEnrolledClass] = useState<{
    id: string;
    name: string;
    teacherName: string;
  } | null>(null);

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

  const handleJoinClass = () => {
    // For now, simulate joining with mock data
    if (classCode.trim().length > 0) {
      // In a real app, this would validate the code against the database
      setEnrolledClass({
        id: 'class-001',
        name: `Class ${classCode.toUpperCase()}`,
        teacherName: 'Ms. Rodriguez',
      });
      setClassCode('');
    }
  };

  const handleLeaveClass = () => {
    setEnrolledClass(null);
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

      {/* Optional Join Class Section */}
      <div className={styles.joinClassSection}>
        {!enrolledClass ? (
          <>
            <div className={styles.joinClassHeader}>
              <h3>Connect with Your Teacher</h3>
              <p>
                Join a class to share your progress with your teacher. This is optional—you can
                always explore on your own.
              </p>
            </div>
            <div className={styles.joinClassForm}>
              <input
                type="text"
                className={styles.codeInput}
                placeholder="Enter class code"
                value={classCode}
                onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleJoinClass();
                  }
                }}
              />
              <Button variant="primary" onClick={handleJoinClass} className={styles.joinButton}>
                Join Class
              </Button>
            </div>
          </>
        ) : (
          <div className={styles.classInfo}>
            <div className={styles.classInfoIcon}>✓</div>
            <div className={styles.classInfoText}>
              <h4>{enrolledClass.name}</h4>
              <p>Teacher: {enrolledClass.teacherName}</p>
            </div>
            <Button
              variant="secondary"
              onClick={handleLeaveClass}
              className={styles.leaveButton}
            >
              Leave Class
            </Button>
          </div>
        )}
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
