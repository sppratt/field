import { Modal, Button } from '@mui/material';
import type { StudentFieldProgress } from '@/lib/db/types';
import styles from '@/app/styles/modals/GoalsModal.module.css';

interface GoalsModalProps {
  open: boolean;
  onClose: () => void;
  progress: StudentFieldProgress[];
}

export function GoalsModal({ open, onClose, progress }: GoalsModalProps) {
  const getProgressPercentage = () => {
    if (progress.length === 0) return 0;
    const completed = progress.filter(p => p.status === 'mastered').length;
    return Math.round((completed / progress.length) * 100);
  };

  const pathwayCompletion = getProgressPercentage();

  return (
    <Modal open={open} onClose={onClose}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Your Goals & Progress</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <h3>Pathway Completion</h3>
            <div className={styles.progressCard}>
              <div className={styles.fraction}>{progress.filter(p => p.status === 'mastered').length}/5</div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${pathwayCompletion}%` }}
                />
              </div>
              <div className={styles.percentage}>{pathwayCompletion}%</div>
            </div>
            <p className={styles.description}>
              ✨ You&apos;re {pathwayCompletion}% through exploring all pathways.
            </p>
          </div>

          {progress.length > 0 && (
            <div className={styles.section}>
              <h3>Your Progress</h3>
              <div className={styles.progressList}>
                {progress.map((p) => (
                  <div key={p.field_id} className={styles.progressItem}>
                    <div className={styles.itemName}>{p.field_id}</div>
                    <div className={styles.itemStatus}>{p.status}</div>
                    <div className={styles.itemBar}>
                      <div
                        className={styles.itemFill}
                        style={{ width: `${(p.levels_completed?.length || 0) / 5 * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
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
