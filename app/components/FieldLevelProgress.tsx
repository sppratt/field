'use client';

import type { StudentFieldProgress } from '@/lib/db/types';
import styles from '@/app/styles/FieldLevelProgress.module.css';
import { Button } from './Button';

interface FieldLevelProgressProps {
  fieldName: string;
  progress: StudentFieldProgress;
  onStartLevel?: (level: number) => void;
  loading?: boolean;
}

export default function FieldLevelProgress({
  fieldName,
  progress,
  onStartLevel,
  loading,
}: FieldLevelProgressProps) {
  const getLevelStatus = (level: number) => {
    if (progress.levels_completed.includes(level)) {
      return 'completed';
    }
    if (level <= progress.current_level) {
      return 'in-progress';
    }
    if (level === progress.current_level + 1 || progress.current_level === 0) {
      return 'available';
    }
    return 'locked';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'in-progress':
        return '→';
      case 'available':
        return '▶';
      case 'locked':
        return '🔒';
      default:
        return '';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Mastered';
      case 'in-progress':
        return 'Current';
      case 'available':
        return 'Ready';
      case 'locked':
        return 'Locked';
      default:
        return '';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>{fieldName}</h3>
        <span className={styles.status}>
          {progress.status === 'mastered'
            ? '🌟 Mastered'
            : progress.status === 'in_progress'
            ? `Level ${progress.current_level}/5`
            : 'Not Started'}
        </span>
      </div>

      <div className={styles.levels}>
        {Array.from({ length: 5 }, (_, i) => i + 1).map(level => {
          const status = getLevelStatus(level);
          const isClickable = status === 'in-progress' || status === 'available';

          return (
            <div
              key={level}
              className={`${styles.levelBox} ${styles[status]}`}
            >
              <div className={styles.levelIcon}>{getStatusIcon(status)}</div>
              <div className={styles.levelNum}>Level {level}</div>
              <div className={styles.levelStatus}>{getStatusLabel(status)}</div>

              {isClickable && (
                <Button
                  size="small"
                  variant={status === 'in-progress' ? 'primary' : 'secondary'}
                  onClick={() => onStartLevel?.(level)}
                  disabled={loading}
                  className={styles.startButton}
                >
                  {status === 'in-progress' ? 'Continue' : 'Start'}
                </Button>
              )}
            </div>
          );
        })}
      </div>

      <div
        className={styles.progressBar}
        role="progressbar"
        aria-valuenow={progress.levels_completed.length}
        aria-valuemin={0}
        aria-valuemax={5}
        aria-label="Field progress"
      >
        <div
          className={styles.fill}
          style={{ width: `${(progress.levels_completed.length / 5) * 100}%` }}
        />
      </div>
      <p className={styles.progressText}>
        {progress.levels_completed.length} of 5 levels completed
      </p>
    </div>
  );
}
