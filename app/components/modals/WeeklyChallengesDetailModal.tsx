'use client';

import { useState } from 'react';
import { Modal, Button } from '@mui/material';
import type { StudentChallenge } from '@/lib/db/types';
import styles from '@/app/styles/modals/WeeklyChallengesDetailModal.module.css';

interface WeeklyChallengesDetailModalProps {
  open: boolean;
  onClose: () => void;
  challenges: StudentChallenge[];
}

const challengeDescriptions: Record<string, { title: string; description: string }> = {
  weekly_new: {
    title: 'Explore a New Career',
    description: 'Start a simulation for a career you haven&apos;t explored yet. See if it matches your interests!',
  },
  compare_careers: {
    title: 'Compare Two Careers',
    description: 'Complete simulations for two different careers and see how they compare in terms of skills and challenges.',
  },
  skill_balance: {
    title: 'Balance Your Skills',
    description: 'Try to score high in all five skill categories. Choose decisions that develop different strengths.',
  },
};

export function WeeklyChallengesDetailModal({
  open,
  onClose,
  challenges,
}: WeeklyChallengesDetailModalProps) {
  const [completing, setCompleting] = useState<string | null>(null);

  const handleCompleteChallenge = async (challenge: StudentChallenge) => {
    setCompleting(challenge.id);
    try {
      const response = await fetch('/api/challenges/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          challengeId: challenge.id,
          challengeType: challenge.challenge_type,
          weekOf: challenge.week_of,
        }),
      });

      if (response.ok) {
        // Refresh page to see updated challenges
        window.location.reload();
      }
    } catch (error) {
      console.error('Error completing challenge:', error);
    } finally {
      setCompleting(null);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Weekly Challenges</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className={styles.content}>
          <p className={styles.description}>
            Optional challenges to keep your exploration on track. Complete them this week for a bonus!
          </p>

          {challenges.length > 0 ? (
            <div className={styles.challengesList}>
              {challenges.map((challenge) => {
                const info = challengeDescriptions[challenge.challenge_type as keyof typeof challengeDescriptions];
                const iconMap: Record<string, string> = {
                  'weekly_new': '🗺️',
                  'compare_careers': '⚖️',
                  'skill_balance': '📊',
                };

                return (
                  <div
                    key={challenge.id}
                    className={`${styles.challengeItem} ${challenge.completed ? styles.completedItem : ''}`}
                  >
                    <div className={styles.challengeIcon}>
                      {iconMap[challenge.challenge_type]}
                    </div>
                    <div className={styles.challengeInfo}>
                      <div className={styles.challengeTitle}>{info?.title}</div>
                      <div className={styles.challengeDescription}>{info?.description}</div>
                      {challenge.completed_at && (
                        <div className={styles.challengeReward}>
                          ✓ Completed on {new Date(challenge.completed_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <div className={styles.challengeActions}>
                      {!challenge.completed && (
                        <button
                          className={styles.completeButton}
                          onClick={() => handleCompleteChallenge(challenge)}
                          disabled={completing === challenge.id}
                        >
                          {completing === challenge.id ? 'Completing...' : 'Mark Done'}
                        </button>
                      )}
                      {challenge.completed && (
                        <div className={styles.completedBadge}>✓ Done</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No challenges this week yet. Check back soon!</p>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
