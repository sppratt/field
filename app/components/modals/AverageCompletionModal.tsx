'use client';

import { useEffect, useState } from 'react';
import styles from './Modal.module.css';

interface AverageCompletionModalProps {
  open: boolean;
  onClose: () => void;
  averagePercentage: number;
  totalStudents: number;
  completedSimulations: number;
}

export function AverageCompletionModal({
  open,
  onClose,
  averagePercentage,
  totalStudents,
  completedSimulations,
}: AverageCompletionModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !open) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Class Completion Progress</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.statsGrid}>
            <div className={styles.statBox}>
              <div className={styles.statLabel}>Average Completion</div>
              <div className={styles.statValue}>{averagePercentage.toFixed(1)}%</div>
              <div className={styles.statDescription}>Across all students</div>
            </div>

            <div className={styles.statBox}>
              <div className={styles.statLabel}>Total Students</div>
              <div className={styles.statValue}>{totalStudents}</div>
              <div className={styles.statDescription}>In your class</div>
            </div>

            <div className={styles.statBox}>
              <div className={styles.statLabel}>Completed Simulations</div>
              <div className={styles.statValue}>{completedSimulations}</div>
              <div className={styles.statDescription}>Class-wide total</div>
            </div>
          </div>

          <div className={styles.insightBox}>
            <p className={styles.insightText}>
              Your class is making steady progress! Encourage students who are behind to explore at least one more pathway.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
