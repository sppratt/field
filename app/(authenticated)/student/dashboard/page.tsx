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
    const status = careerProgress?.status || 'not_started';
    // Map status to visual state: not_started, planted (has started but no progress), in_progress, completed
    if (status === 'not_started') return 'not_started';
    if (status === 'completed') return 'completed';
    // Else: in_progress state becomes 'in_progress'
    return 'in_progress';
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
      {/* Hero: Full-width immersive top section */}
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.welcomeHeading}>Welcome, {user?.name}!</h1>
          <p className={styles.welcomeSubtext}>Your personal career exploration journey</p>

          <h2 className={styles.heroHeadline}>Your field is growing</h2>
          <p className={styles.heroSubheading}>
            Track your exploration across different career paths. Each simulation you complete adds depth to your understanding.
          </p>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{summary.notStarted}</div>
              <p className={styles.statLabel}>Not Started</p>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{summary.inProgress}</div>
              <p className={styles.statLabel}>In Progress</p>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{summary.completed}</div>
              <p className={styles.statLabel}>Completed</p>
            </div>
          </div>
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

      <div className={styles.section}>
        <h2>Your Fields</h2>
        <p className={styles.sectionSubheading}>Explore and cultivate your interests</p>
        <div className={styles.pathwaysGrid}>
          {careers.map((career) => {
            const status = getProgressStatus(career.id);
            const percentage = getProgressPercentage(career.id);

            // Career icon mapping (illustrated emoji-based for now)
            const careerIcons: Record<string, string> = {
              'software-engineer': '🔌',
              'nurse': '🩺',
              'graphic-designer': '🎨',
              'data-analyst': '📈',
              'architect': '🏛️',
            };
            const icon = careerIcons[career.id] || '🌱';

            // Career metadata
            const careerMetadata: Record<
              string,
              { seedType: string; difficulty: string; growthTime: string; skills: string[] }
            > = {
              'software-engineer': {
                seedType: 'Problem Solver',
                difficulty: 'Medium',
                growthTime: '2-4 yrs',
                skills: ['Logic', 'Creativity'],
              },
              'nurse': {
                seedType: 'Healer',
                difficulty: 'Hard',
                growthTime: '2-6 yrs',
                skills: ['Empathy', 'Science'],
              },
              'graphic-designer': {
                seedType: 'Creator',
                difficulty: 'Medium',
                growthTime: '1-3 yrs',
                skills: ['Design', 'Vision'],
              },
              'data-analyst': {
                seedType: 'Analyst',
                difficulty: 'Hard',
                growthTime: '1-2 yrs',
                skills: ['Math', 'Insight'],
              },
              'architect': {
                seedType: 'Builder',
                difficulty: 'Hard',
                growthTime: '5-7 yrs',
                skills: ['Vision', 'Planning'],
              },
            };

            const metadata = careerMetadata[career.id] || {
              seedType: 'Explorer',
              difficulty: 'Medium',
              growthTime: '2-4 yrs',
              skills: ['Discovery'],
            };

            // Growth stage icons
            const growthStages = ['🌱', '🌿', '🌳', '🌸'];
            const currentStage = Math.ceil((percentage / 100) * growthStages.length) - 1;

            return (
              <Link
                key={career.id}
                href={`/pathways/${career.id}`}
                className={`${styles.pathwayCard} ${styles[`pathwayCard-${status}`]}`}
              >
                {/* Packet accent stripe */}
                <div className={styles.packetAccent} />

                {/* Progress badge - visible for in_progress and completed */}
                {(status === 'in_progress' || status === 'completed') && (
                  <div className={styles.progressBadge}>
                    {status === 'completed' ? '🌸' : `${Math.min(percentage, 99)}%`}
                  </div>
                )}

                {/* Seed Packet Header */}
                <div className={styles.packetHeader}>
                  <div className={styles.packetIllustration}>{icon}</div>
                  <div className={styles.packetLabel}>
                    <h3>{career.title}</h3>
                  </div>
                </div>

                <div className={styles.cardContent}>
                  {/* Packet Metadata */}
                  <div className={styles.packetMetadata}>
                    <div className={styles.metadataItem}>
                      <div className={styles.metadataLabel}>Seed Type</div>
                      <div className={styles.metadataValue}>{metadata.seedType}</div>
                    </div>
                    <div className={styles.metadataItem}>
                      <div className={styles.metadataLabel}>Difficulty</div>
                      <div className={styles.metadataValue}>{metadata.difficulty}</div>
                    </div>
                  </div>

                  <p className={styles.description}>{career.description}</p>

                  {/* Growth stage indicator */}
                  {(status === 'in_progress' || status === 'completed') && (
                    <div className={styles.growthStage}>
                      {growthStages.map((stage, i) => (
                        <span
                          key={i}
                          className={`${styles.stageIcon} ${
                            i <= currentStage ? styles.active : ''
                          }`}
                        >
                          {stage}
                        </span>
                      ))}
                    </div>
                  )}

                  {status !== 'not_started' && (
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  )}

                  <div className={styles.cardFooter}>
                    <span
                      className={`${styles.badge} ${styles[`badge-${status}`]}`}
                    >
                      {status === 'not_started' && 'Ready to Plant'}
                      {status === 'in_progress' && 'Growing'}
                      {status === 'completed' && 'Bloomed'}
                    </span>
                    <span className={styles.statusText}>
                      {status === 'not_started' && 'Explore now'}
                      {status === 'in_progress' && `${percentage}% grown`}
                      {status === 'completed' && 'Fully grown'}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
