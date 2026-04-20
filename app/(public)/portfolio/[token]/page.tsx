'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import styles from './PortfolioPage.module.css';
import { getAggregateTagScores, getSkillLabel, getSkillEmoji, SkillTag } from '@/app/utils/skillScoring';
import { rankCareersForStudent } from '@/app/utils/careerMatching';
import { careers } from '@/app/data/careers';
import type { StudentProgress, StudentAchievement, User } from '@/lib/db/types';

interface PortfolioData {
  portfolio: { user_id: string; public_token: string };
  user: Partial<User>;
  progress: StudentProgress[];
  achievements: StudentAchievement[];
}

const skillOrder: SkillTag[] = ['analytical', 'creative', 'hands_on', 'social', 'problem_solving'];
const careerIcons: Record<string, string> = {
  'software-engineer': '⚙️',
  'nurse': '💊',
  'graphic-designer': '🎨',
  'data-analyst': '📊',
  'architect': '🏗️',
};

export default function PortfolioPage() {
  const params = useParams();
  const token = params.token as string;
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await fetch(`/api/portfolio/${token}`);
        if (!res.ok) {
          setError('Portfolio not found');
          setLoading(false);
          return;
        }

        const portfolioData = await res.json();
        setData(portfolioData);
      } catch (err) {
        console.error('Error fetching portfolio:', err);
        setError('Failed to load portfolio');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [token]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>Loading portfolio...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <h1>Portfolio Not Found</h1>
          <p>{error || 'This portfolio could not be accessed.'}</p>
        </div>
      </div>
    );
  }

  const { user, progress, achievements } = data;
  const skillScores = getAggregateTagScores(progress);
  const completedCount = progress.filter(p => p.status === 'completed').length;
  const exploredCount = progress.filter(p => p.status !== 'not_started').length;
  const rankedCareers = rankCareersForStudent(careers, skillScores).slice(0, 3);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Career Exploration Portfolio</h1>
          <p className={styles.subtitle}>
            {user.name ? `${user.name}'s` : 'A student\'s'} journey through career exploration
          </p>
          <p className={styles.date}>
            Started {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'recently'}
          </p>
        </div>
      </div>

      <div className={styles.content}>
        {/* Skills Section */}
        <section className={styles.section}>
          <h2>Skills Developed</h2>
          <div className={styles.skillsGrid}>
            {skillOrder.map(skill => {
              const score = skillScores[skill];
              const maxScore = Math.max(...Object.values(skillScores), 10);
              const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

              return (
                <div key={skill} className={styles.skillCard}>
                  <span className={styles.skillEmoji}>{getSkillEmoji(skill)}</span>
                  <h3>{getSkillLabel(skill)}</h3>
                  <div className={styles.skillBar}>
                    <div className={styles.skillFill} style={{ width: `${percentage}%` }} />
                  </div>
                  <p className={styles.skillScore}>{Math.round(score)} points</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Progress Section */}
        <section className={styles.section}>
          <h2>Exploration Progress</h2>
          <div className={styles.statsGrid}>
            <div className={styles.stat}>
              <div className={styles.statNumber}>{exploredCount}</div>
              <p>Careers Explored</p>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNumber}>{completedCount}</div>
              <p>Completed</p>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNumber}>{achievements.length}</div>
              <p>Achievements</p>
            </div>
          </div>
        </section>

        {/* Top Career Matches */}
        {rankedCareers.length > 0 && (
          <section className={styles.section}>
            <h2>Top Career Matches</h2>
            <div className={styles.careersGrid}>
              {rankedCareers.map((match, idx) => (
                <div key={match.career.id} className={styles.careerCard}>
                  <div className={styles.careerRank}>#{idx + 1}</div>
                  <div className={styles.careerIcon}>{careerIcons[match.career.id] || '💼'}</div>
                  <h3>{match.career.title}</h3>
                  <div className={styles.matchPercentage}>{match.matchPercentage}% match</div>
                  <p className={styles.careerDescription}>{match.reasoning}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Achievements Section */}
        {achievements.length > 0 && (
          <section className={styles.section}>
            <h2>Achievements Unlocked</h2>
            <div className={styles.achievementsGrid}>
              {achievements.map(achievement => (
                <div key={achievement.id} className={styles.achievementItem}>
                  <p className={styles.achievementType}>{achievement.achievement_type.replace(/_/g, ' ')}</p>
                  <p className={styles.achievementDate}>
                    {new Date(achievement.earned_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Call to Action */}
        <section className={styles.ctaSection}>
          <h2>Interested in Career Exploration?</h2>
          <p>Explore careers through interactive simulations and discover your path forward.</p>
          <a href="/" className={styles.ctaButton}>
            Get Started with Field
          </a>
        </section>
      </div>

      <footer className={styles.footer}>
        <p>Made with Field • Career Exploration Platform</p>
      </footer>
    </div>
  );
}
