'use client';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import styles from './TeacherModals.module.css';

interface Student {
  id: string;
  name: string;
  email: string;
  pathways_started: number;
  pathways_completed: number;
  completion_percentage: number;
  last_active: string | null;
}

interface StudentDetailModalProps {
  open: boolean;
  onClose: () => void;
  student: Student | null;
}

function formatDate(dateString: string | null): string {
  if (!dateString) return 'Not started';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export const StudentDetailModal = ({ open, onClose, student }: StudentDetailModalProps) => {
  if (!student) return null;

  return (
    <Dialog open={open} onClose={onClose} className={styles.dialog} maxWidth="sm" fullWidth>
      <DialogTitle className={styles.dialogTitle}>
        <span className={styles.titleText}>{student.name}</span>
        <span className={styles.titleSubtext}>Individual progress</span>
      </DialogTitle>
      <DialogContent className={styles.dialogContent}>
        <div className={styles.studentDetailCard}>
          <div className={styles.studentDetailSection}>
            <div className={styles.detailLabel}>Email</div>
            <div className={styles.detailValue}>{student.email}</div>
          </div>

          <div className={styles.studentDetailStats}>
            <div className={styles.detailStatItem} style={{ animationDelay: '0ms' }}>
              <div className={styles.detailStatLabel}>Fields Started</div>
              <div className={styles.detailStatNumber}>{student.pathways_started}</div>
            </div>
            <div className={styles.detailStatItem} style={{ animationDelay: '50ms' }}>
              <div className={styles.detailStatLabel}>Completed</div>
              <div className={styles.detailStatNumber}>{student.pathways_completed}</div>
            </div>
            <div className={styles.detailStatItem} style={{ animationDelay: '100ms' }}>
              <div className={styles.detailStatLabel}>Progress</div>
              <div className={styles.detailStatNumber}>{student.completion_percentage}%</div>
            </div>
          </div>

          <div className={styles.studentDetailSection}>
            <div className={styles.detailLabel}>Last Active</div>
            <div className={styles.detailValue}>{formatDate(student.last_active)}</div>
            <div className={styles.detailStatus}>
              {student.last_active ? (
                <span className={styles.statusGreen}>✓ Active</span>
              ) : (
                <span className={styles.statusGray}>Inactive</span>
              )}
            </div>
          </div>

          <div className={styles.progressSection}>
            <div className={styles.detailLabel}>Overall Progress</div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${student.completion_percentage}%` }} />
            </div>
            <div className={styles.progressText}>{student.completion_percentage}% complete</div>
          </div>

          <div className={styles.actionHint}>
            {student.completion_percentage < 25 && (
              <p>💡 <strong>Tip:</strong> This student is just getting started. Consider checking in to offer support.</p>
            )}
            {student.completion_percentage >= 25 && student.completion_percentage < 75 && (
              <p>💡 <strong>Tip:</strong> Good progress! Encourage them to explore another field.</p>
            )}
            {student.completion_percentage >= 75 && (
              <p>🌟 <strong>Great work:</strong> This student is showing strong engagement!</p>
            )}
          </div>
        </div>
      </DialogContent>
      <DialogActions className={styles.dialogActions}>
        <Button onClick={onClose} variant="outlined" className={styles.button}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
