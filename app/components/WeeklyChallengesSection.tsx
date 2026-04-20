'use client';

import styles from '@/app/styles/WeeklyChallengesSection.module.css';
import { Button } from './Button';
import type { StudentChallenge } from '@/lib/db/types';

interface WeeklyChallengesSectionProps {
  challenges: StudentChallenge[];
  onChallengeClick?: (challengeType: string) => void;
}

const challengeDescriptions: Record<string, { emoji: string; title: string; description: string }> = {
  weekly_new: {
    emoji: '🆕',
    title: 'Try Something New',
    description: 'Explore a pathway you haven\'t started yet this week',
  },
  compare_careers: {
    emoji: '⚖️',
    title: 'Compare Careers',
    description: 'Look at your top 2 matched careers side-by-side',
  },
  skill_balance: {
    emoji: '⚡',
    title: 'Skill Balance',
    description: 'Work on developing your weakest skill area',
  },
};

export function WeeklyChallengesSection({
  challenges,
  onChallengeClick,
}: WeeklyChallengesSectionProps) {
  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h2 className={styles.title}>Weekly Challenges</h2>
        <p className={styles.subtitle}>
          Optional challenges to keep your exploration on track
        </p>

        {challenges.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No challenges this week yet. Check back soon!</p>
          </div>
        ) : (
          <div className={styles.challengesGrid}>
            {challenges.map((challenge, idx) => {
              const info = challengeDescriptions[challenge.challenge_type] || {
                emoji: '🎯',
                title: 'Challenge',
                description: 'Complete this week\'s challenge',
              };

              return (
                <div
                  key={challenge.id}
                  className={`${styles.challengeCard} ${challenge.completed ? styles.completed : ''}`}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className={styles.emoji}>{info.emoji}</div>
                  <h3 className={styles.challengeTitle}>{info.title}</h3>
                  <p className={styles.challengeDesc}>{info.description}</p>

                  {challenge.completed ? (
                    <div className={styles.completedBadge}>✓ Completed</div>
                  ) : (
                    <Button
                      variant="secondary"
                      onClick={() => onChallengeClick?.(challenge.challenge_type)}
                      className={styles.actionButton}
                    >
                      Take Challenge
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
