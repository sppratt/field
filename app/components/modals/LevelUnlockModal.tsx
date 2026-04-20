'use client';

import { useEffect, useRef } from 'react';
import styles from '@/app/styles/modals/LevelUnlockModal.module.css';
import { Button } from '../Button';

interface LevelUnlockModalProps {
  level: number;
  score: number;
  unlockedNext: boolean;
  onContinue: () => void;
}

export default function LevelUnlockModal({
  level,
  score,
  unlockedNext,
  onContinue,
}: LevelUnlockModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    buttonRef.current?.focus();

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onContinue();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onContinue]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  return (
    <div className={styles.overlay} role="presentation" aria-hidden="true">
      <div
        ref={modalRef}
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onKeyDown={handleKeyDown}
      >
        {unlockedNext ? (
          <>
            <div className={styles.celebration}>🎉</div>
            <h2 id="modal-title" className={styles.title}>Level {level} Mastered!</h2>
            <p className={styles.subtitle}>
              You've successfully completed this level with a score of{' '}
              <strong>{Math.round(score)}%</strong>
            </p>
            <div className={styles.unlockMessage}>
              <p>✨ Level {level + 1} is now unlocked!</p>
              <p>Ready to take on a new challenge?</p>
            </div>
          </>
        ) : (
          <>
            <div className={styles.score}>{Math.round(score)}%</div>
            <h2 id="modal-title" className={styles.title}>Keep Practicing!</h2>
            <p className={styles.subtitle}>
              You scored {Math.round(score)}%. You need 75% to advance.
            </p>
            <div className={styles.feedback}>
              <p>Don't worry—you're getting closer! Each attempt helps you learn.</p>
              <p>Try again and focus on different approaches.</p>
            </div>
          </>
        )}

        <Button
          ref={buttonRef}
          onClick={onContinue}
          className={styles.button}
          aria-label={unlockedNext ? `Start Level ${level + 1}` : 'Try Again'}
        >
          {unlockedNext ? `Start Level ${level + 1}` : 'Try Again'}
        </Button>
      </div>
    </div>
  );
}
