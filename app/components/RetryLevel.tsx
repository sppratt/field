'use client';

import { useState, useEffect } from 'react';
import type { StudentLevelAttempt, QuizTemplate } from '@/lib/db/types';
import styles from '@/app/styles/RetryLevel.module.css';
import { Button } from './Button';
import QuizLevelFlow from './QuizLevelFlow';

interface RetryLevelProps {
  template: QuizTemplate;
  fieldId: string;
  level: number;
  previousAttempts: StudentLevelAttempt[];
  onSuccess?: (score: number) => void;
}

export default function RetryLevel({
  template,
  fieldId,
  level,
  previousAttempts,
  onSuccess,
}: RetryLevelProps) {
  const [showQuiz, setShowQuiz] = useState(false);
  const [bestScore, setBestScore] = useState(0);

  useEffect(() => {
    if (previousAttempts.length > 0) {
      const best = Math.max(...previousAttempts.map(a => a.score));
      setBestScore(best);
    }
  }, [previousAttempts]);

  if (showQuiz) {
    return (
      <QuizLevelFlow
        template={template}
        fieldId={fieldId}
        level={level}
        onComplete={(score) => {
          if (score >= 75) {
            onSuccess?.(score);
          }
        }}
        onRetry={() => setShowQuiz(true)}
      />
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Practice Level {level}</h2>
        <p className={styles.subtitle}>Improve your score and master this level</p>
      </div>

      <div className={styles.stats}>
        <div className={styles.statBox}>
          <div className={styles.statLabel}>Attempts</div>
          <div className={styles.statValue}>{previousAttempts.length}</div>
        </div>
        <div className={styles.statBox}>
          <div className={styles.statLabel}>Best Score</div>
          <div className={styles.statValue}>{Math.round(bestScore)}%</div>
        </div>
        <div className={styles.statBox}>
          <div className={styles.statLabel}>To Unlock</div>
          <div className={styles.statValue}>75%</div>
        </div>
      </div>

      <div className={styles.attempts}>
        <h3>Your Attempts</h3>
        <div className={styles.attemptsList}>
          {previousAttempts.map((attempt, idx) => (
            <div key={attempt.id} className={styles.attemptItem}>
              <span className={styles.attemptNumber}>Attempt {idx + 1}</span>
              <span className={styles.attemptScore}>{Math.round(attempt.score)}%</span>
              {attempt.unlocked_next_level && (
                <span className={styles.badge}>✓ Unlocked</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.encouragement}>
        {bestScore < 75 && (
          <p>
            💡 You're close! Try a different approach to the decisions. Think about what each
            choice reveals about the character.
          </p>
        )}
        {bestScore >= 75 && (
          <p>
            ✨ Great job! You've mastered this level. Ready to move to the next challenge?
          </p>
        )}
      </div>

      <div className={styles.footer}>
        <Button onClick={() => setShowQuiz(true)}>
          {bestScore >= 75 ? 'Continue to Next Level' : 'Try Again'}
        </Button>
      </div>
    </div>
  );
}
