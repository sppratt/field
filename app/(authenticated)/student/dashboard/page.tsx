'use client';

import { useEffect, useState } from 'react';

// Disable static generation for this page (requires auth)
export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCurrentUserProfile } from '@/lib/db/users';

import { careers } from '@/app/data/careers';
import type { User, StudentFieldProgress } from '@/lib/db/types';
import styles from './StudentDashboard.module.css';
import { Button } from '@/app/components/Button';
import { CareerCard } from '@/app/components/CareerCard';
import { InfoIcon } from '@/app/components/InfoIcon';
import { DashboardStatsCards } from '@/app/components/DashboardStatsCards';
import { PathwaysExploredModal } from '@/app/components/modals/PathwaysExploredModal';
import { SkillsFoundModal } from '@/app/components/modals/SkillsFoundModal';
import { TopSkillModal } from '@/app/components/modals/TopSkillModal';
import { CareerCalculationModal } from '@/app/components/modals/CareerCalculationModal';
import { WeeklyActivityModal } from '@/app/components/modals/WeeklyActivityModal';
import { AchievementsModal } from '@/app/components/modals/AchievementsModal';
import { CareerMatchRankingsModal } from '@/app/components/modals/CareerMatchRankingsModal';
import { GoalsModal } from '@/app/components/modals/GoalsModal';
import { SkillMasteryModal } from '@/app/components/modals/SkillMasteryModal';
import { WeeklyChallengesDetailModal } from '@/app/components/modals/WeeklyChallengesDetailModal';
import { getUserAchievements } from '@/lib/db/achievements';
import { getCurrentWeekChallenges, generateWeekChallenges } from '@/lib/db/challenges';
import { getAggregateTagScores } from '@/app/utils/skillScoring';
import type { StudentAchievement, StudentChallenge } from '@/lib/db/types';

const careerIcons: Record<string, string> = {
  'software-engineer': '⚙️',
  'nurse': '💊',
  'graphic-designer': '🎨',
  'data-analyst': '📊',
  'architect': '🏗️',
};

const careerColors: Record<string, string> = {
  'software-engineer': 'var(--career-software-engineer)',
  'nurse': 'var(--career-nurse)',
  'graphic-designer': 'var(--career-graphic-designer)',
  'data-analyst': 'var(--career-data-analyst)',
  'architect': 'var(--career-architect)',
};

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<StudentFieldProgress[]>([]);
  const [summary, setSummary] = useState({ notStarted: 0, inProgress: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [classCode, setClassCode] = useState('');
  const [enrolledClass, setEnrolledClass] = useState<{
    id: string;
    name: string;
    teacherName: string;
  } | null>(null);

  // Engagement features state
  const [achievements, setAchievements] = useState<StudentAchievement[]>([]);
  const [challenges, setChallenges] = useState<StudentChallenge[]>([]);

  // Modal state
  const [modalsOpen, setModalsOpen] = useState({
    pathwaysExplored: false,
    skillsFound: false,
    topSkill: false,
    bestMatch: false,
    runnerUpMatch: false,
    weeklyActivity: false,
    achievements: false,
    careerRankings: false,
    goals: false,
    skills: false,
    challenges: false,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const userProfile = await getCurrentUserProfile();
        if (!userProfile) {
          router.push('/auth/login');
          return;
        }

        setUser(userProfile);

        const progressRes = await fetch('/api/field-progress', {
          credentials: 'include',
        });
        if (progressRes.ok) {
          const progressData = await progressRes.json();
          setProgress(progressData.fields || []);
        }

        // Load engagement features
        const userAchievements = await getUserAchievements(userProfile.id);
        setAchievements(userAchievements);

        let userChallenges = await getCurrentWeekChallenges(userProfile.id);
        if (userChallenges.length === 0) {
          userChallenges = await generateWeekChallenges(userProfile.id);
        }
        setChallenges(userChallenges);
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  // Calculate summary stats whenever progress changes
  useEffect(() => {
    const notStarted = progress.filter((p) => !p || p.status === 'not_started').length;
    const completed = progress.filter((p) => p.levels_completed?.length === 5).length;
    const inProgress = progress.length - notStarted - completed;

    setSummary({ notStarted, inProgress, completed });
  }, [progress]);

  const getProgressStatus = (careerTitle: string) => {
    const careerProgress = progress.find((p) => p.field_id === careerTitle.toLowerCase());
    if (!careerProgress) return 'not_started';

    // Check if all 5 levels are completed
    const allLevelsCompleted = careerProgress.levels_completed?.length === 5;
    if (allLevelsCompleted) return 'completed';

    const status = careerProgress.status || 'not_started';
    if (status === 'not_started') return 'not_started';

    // Else: in_progress state becomes 'in_progress'
    return 'in_progress';
  };

  const getProgressPercentage = (careerTitle: string) => {
    const careerProgress = progress.find((p) => p.field_id === careerTitle.toLowerCase());
    if (!careerProgress) return 0;
    return (careerProgress.levels_completed?.length || 0) / 5 * 100;
  };

  const [tagScores, setTagScores] = useState({
    analytical: 0,
    creative: 0,
    hands_on: 0,
    social: 0,
    problem_solving: 0,
  });

  useEffect(() => {
    const fetchTagScores = async () => {
      try {
        const response = await fetch('/api/tag-scores', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setTagScores(data.tagScores);
        }
      } catch (error) {
        console.error('Error fetching tag scores:', error);
      }
    };

    fetchTagScores();
  }, []);

  const getTagScores = () => tagScores;

  const getTopSkill = () => {
    const tagScores = getTagScores();
    const topTag = Object.entries(tagScores).sort((a, b) => b[1] - a[1])[0];
    if (!topTag || topTag[1] === 0) return null;
    return topTag[0].replace(/_/g, ' ').charAt(0).toUpperCase() + topTag[0].slice(1).replace(/_/g, ' ');
  };

  const getTopCareerMatch = () => {
    if (progress.length === 0) return null;
    const tagScores = getTagScores();

    // Calculate match score for each career
    const careerScores = careers.map((c) => {
      const score = c.recommendationTags.reduce((sum, tag) => sum + (tagScores[tag as keyof typeof tagScores] || 0), 0);
      return { career: c, score };
    });

    const topMatch = careerScores.sort((a, b) => b.score - a.score)[0];
    if (!topMatch || topMatch.score === 0) return null;
    return topMatch.career;
  };

  const getRecommendedCareers = () => {
    // Calculate aggregate tag scores from all completed/in-progress simulations
    const tagScores = getTagScores();

    // Find top 2 tags
    const topTags = Object.entries(tagScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([tag]) => tag);

    // Find not-started careers that match top tags
    const notStartedCareers = careers.filter((c) => {
      const careerProgress = progress.find((p) => p.field_id === c.id);
      return !careerProgress || careerProgress.status === 'not_started';
    });

    const recommendedCareers = notStartedCareers
      .filter((c) =>
        topTags.some((tag) => c.recommendationTags.includes(tag as any))
      )
      .slice(0, 3);

    return recommendedCareers;
  };

  const getPathwaysExplored = () => {
    return progress.filter((p) => p.status !== 'not_started').length;
  };

  const getSkillsDiscovered = () => {
    const tagScores = getTagScores();
    return Object.values(tagScores).filter((score) => score > 0).length;
  };

  const getNextBestMatch = () => {
    if (progress.length === 0) return null;
    const tagScores = getTagScores();

    const careerScores = careers.map((c) => {
      const score = c.recommendationTags.reduce((sum, tag) => sum + (tagScores[tag as keyof typeof tagScores] || 0), 0);
      return { career: c, score };
    });

    const sortedCareers = careerScores.sort((a, b) => b.score - a.score);
    if (sortedCareers.length < 2 || sortedCareers[1].score === 0) return null;
    return sortedCareers[1].career;
  };

  const getThisWeekProgress = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return progress.filter((p) => {
      const updatedAt = p.updated_at ? new Date(p.updated_at) : null;
      return updatedAt && updatedAt >= oneWeekAgo && p.status === 'mastered';
    }).length;
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

          <div className={styles.heroRow}>
            <div className={styles.heroGrowthSection}>
              <h2 className={styles.heroHeadline}>Your field is growing</h2>
              <p className={styles.heroSubheading}>
                Track your exploration across different career paths. Each simulation you complete adds depth to your understanding.
              </p>
            </div>

            <div className={styles.statsContainer}>
              <h3 className={styles.statsHeading}>Your Stats</h3>
              <div className={styles.statsGrid}>
              <button
                onClick={() => {
                  document.getElementById('in-progress-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={styles.statCard}
              >
                <div className={styles.statNumber}>{summary.inProgress}</div>
                <p className={styles.statLabel}>Simulations In Progress</p>
              </button>
              <button
                onClick={() => {
                  document.getElementById('completed-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={styles.statCard}
              >
                <div className={styles.statNumber}>{summary.completed}</div>
                <p className={styles.statLabel}>Simulations Completed</p>
              </button>
              <div
                className={styles.statCard}
                title="Click to see all explored pathways"
                onClick={() => setModalsOpen({ ...modalsOpen, pathwaysExplored: true })}
              >
                <InfoIcon label="See all explored pathways" />
                <div className={styles.statNumber}>{getPathwaysExplored()}</div>
                <p className={styles.statLabel}>Pathways Explored</p>
              </div>
              {/* <div
                className={styles.statCard}
                title="Click to see skill breakdown"
                onClick={() => setModalsOpen({ ...modalsOpen, skillsFound: true })}
              >
                <InfoIcon label="See skill breakdown" />
                <div className={styles.statNumber}>{getSkillsDiscovered()}/5</div>
                <p className={styles.statLabel}>Skills Found</p>
              </div> */}
              {getTopSkill() && (
                <div
                  className={styles.statCard}
                  title="Click to see matching careers"
                  onClick={() => setModalsOpen({ ...modalsOpen, topSkill: true })}
                >
                  <InfoIcon label="See careers that match this skill" />
                  <p className={styles.statLabel} style={{ fontSize: '0.65rem', marginBottom: '0.5rem' }}>Your Top Skill</p>
                  <div className={styles.statLabel} style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                    {getTopSkill()}
                  </div>
                </div>
              )}
              {getTopCareerMatch() && (
                <div
                  className={styles.statCard}
                  title="Click to see how we calculated this"
                  onClick={() => setModalsOpen({ ...modalsOpen, bestMatch: true })}
                >
                  <InfoIcon label="How we calculated this match" />
                  <p className={styles.statLabel} style={{ fontSize: '0.65rem', marginBottom: '0.5rem' }}>Your Best Match</p>
                  <div className={styles.statNumber} style={{ fontSize: '1.5rem' }}>
                    {careerIcons[getTopCareerMatch()!.id]}
                  </div>
                  <p className={styles.statLabel}>{getTopCareerMatch()!.title}</p>
                </div>
              )}
              {getNextBestMatch() && (
                <div
                  className={styles.statCard}
                  title="Click to see how we calculated this"
                  onClick={() => setModalsOpen({ ...modalsOpen, runnerUpMatch: true })}
                >
                  <InfoIcon label="How we calculated this match" />
                  <p className={styles.statLabel} style={{ fontSize: '0.65rem', marginBottom: '0.5rem' }}>Runner-Up Match</p>
                  <div className={styles.statNumber} style={{ fontSize: '1.5rem' }}>
                    {careerIcons[getNextBestMatch()!.id]}
                  </div>
                  <p className={styles.statLabel}>{getNextBestMatch()!.title}</p>
                </div>
              )}
              <div
                className={styles.statCard}
                title="Click to see weekly activity"
                onClick={() => setModalsOpen({ ...modalsOpen, weeklyActivity: true })}
              >
                <InfoIcon label="See weekly activity breakdown" />
                <div className={styles.statNumber}>{getThisWeekProgress()}</div>
                <p className={styles.statLabel}>Completed This Week</p>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards Row */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 var(--spacing-2xl)' }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 1rem 0' }}>
          Your Dashboard
        </h3>
      </div>
      <DashboardStatsCards
        progress={progress}
        achievements={achievements}
        challenges={challenges}
        onOpenGoals={() => setModalsOpen({ ...modalsOpen, goals: true })}
        onOpenSkills={() => setModalsOpen({ ...modalsOpen, skills: true })}
        onOpenAchievements={() => setModalsOpen({ ...modalsOpen, achievements: true })}
        onOpenCareers={() => setModalsOpen({ ...modalsOpen, careerRankings: true })}
        onOpenChallenges={() => setModalsOpen({ ...modalsOpen, challenges: true })}
      />


      {/* Recommended Section - Moved to top for discovery-first flow */}
      <div id="recommended-section" className={styles.recommendedSection}>
        <h2>Recommended for You</h2>
        <p className={styles.sectionSubheading}>Based on your strongest skills</p>
        <div className={styles.pathwaysGrid}>
          {getRecommendedCareers().map((career) => (
            <CareerCard
              key={career.id}
              id={career.id}
              title={career.title}
              description={career.description}
              level={career.level}
              keySkills={career.keySkills}
              icon={careerIcons[career.id]}
              accentColor={careerColors[career.id]}
              progress={0}
              status="not_started"
              isDashboard={true}
              showTear={false}
            />
          ))}
        </div>
        {getRecommendedCareers().length === 0 && (
          <p className={styles.emptyState}>
            Complete simulations to get personalized recommendations! <Link href="/pathways" className={styles.emptyStateLink}>Start exploring</Link>
          </p>
        )}
      </div>

      {/* In Progress Section */}
      <div id="in-progress-section" className={styles.section}>
        <h2>In Progress</h2>
        <p className={styles.sectionSubheading}>Continue exploring these fields</p>
        <div className={styles.pathwaysGrid}>
          {careers
            .filter((career) => {
              const status = getProgressStatus(career.id);
              return status === 'in_progress';
            })
            .map((career) => {
              const status = getProgressStatus(career.id);
              const percentage = getProgressPercentage(career.id);

              return (
                <CareerCard
                  key={career.id}
                  id={career.id}
                  title={career.title}
                  description={career.description}
                  level={career.level}
                  keySkills={career.keySkills}
                  icon={careerIcons[career.id]}
                  accentColor={careerColors[career.id]}
                  progress={percentage}
                  status={status}
                  isDashboard={true}
                  showTear={false}
                />
              );
            })}
        </div>
        {careers.filter((c) => {
          const status = getProgressStatus(c.id);
          return status === 'in_progress';
        }).length === 0 && (
          <p className={styles.emptyState}>
            No fields in progress yet. Head to <Link href="/pathways" className={styles.emptyStateLink}>Explore Fields</Link> to get started!
          </p>
        )}
      </div>

      {/* Completed Section */}
      <div id="completed-section" className={styles.section}>
        <h2>Completed</h2>
        <p className={styles.sectionSubheading}>Fields you&apos;ve mastered</p>
        <div className={styles.pathwaysGrid}>
          {careers
            .filter((career) => {
              const status = getProgressStatus(career.id);
              return status === 'completed';
            })
            .map((career) => {
              const status = getProgressStatus(career.id);
              const percentage = getProgressPercentage(career.id);

              return (
                <CareerCard
                  key={career.id}
                  id={career.id}
                  title={career.title}
                  description={career.description}
                  level={career.level}
                  keySkills={career.keySkills}
                  icon={careerIcons[career.id]}
                  accentColor={careerColors[career.id]}
                  progress={percentage}
                  status={status}
                  isDashboard={true}
                  showTear={false}
                />
              );
            })}
        </div>
        {careers.filter((c) => {
          const status = getProgressStatus(c.id);
          return status === 'completed';
        }).length === 0 && (
          <p className={styles.emptyState}>
            Complete simulations to see them appear here!
          </p>
        )}
      </div>

      {/* Optional Join Class Section - At bottom */}
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

      {/* Modals */}
      <PathwaysExploredModal
        open={modalsOpen.pathwaysExplored}
        onClose={() => setModalsOpen({ ...modalsOpen, pathwaysExplored: false })}
        progress={progress}
      />
      <SkillsFoundModal
        open={modalsOpen.skillsFound}
        onClose={() => setModalsOpen({ ...modalsOpen, skillsFound: false })}
        progress={progress}
      />
      <TopSkillModal
        open={modalsOpen.topSkill}
        onClose={() => setModalsOpen({ ...modalsOpen, topSkill: false })}
        topSkill={getTopSkill()}
        progress={progress}
      />
      <CareerCalculationModal
        open={modalsOpen.bestMatch}
        onClose={() => setModalsOpen({ ...modalsOpen, bestMatch: false })}
        career={getTopCareerMatch()}
        progress={progress}
      />
      <CareerCalculationModal
        open={modalsOpen.runnerUpMatch}
        onClose={() => setModalsOpen({ ...modalsOpen, runnerUpMatch: false })}
        career={getNextBestMatch()}
        progress={progress}
      />
      <WeeklyActivityModal
        open={modalsOpen.weeklyActivity}
        onClose={() => setModalsOpen({ ...modalsOpen, weeklyActivity: false })}
        progress={progress}
      />
      <AchievementsModal
        open={modalsOpen.achievements}
        onClose={() => setModalsOpen({ ...modalsOpen, achievements: false })}
        achievements={achievements}
      />
      <CareerMatchRankingsModal
        open={modalsOpen.careerRankings}
        onClose={() => setModalsOpen({ ...modalsOpen, careerRankings: false })}
        skillScores={getTagScores()}
      />

      {/* New modals for stats cards */}
      <GoalsModal
        open={modalsOpen.goals}
        onClose={() => setModalsOpen({ ...modalsOpen, goals: false })}
        progress={progress}
      />
      <SkillMasteryModal
        open={modalsOpen.skills}
        onClose={() => setModalsOpen({ ...modalsOpen, skills: false })}
        progress={progress}
      />
      <WeeklyChallengesDetailModal
        open={modalsOpen.challenges}
        onClose={() => setModalsOpen({ ...modalsOpen, challenges: false })}
        challenges={challenges}
      />
    </div>
  );
}
