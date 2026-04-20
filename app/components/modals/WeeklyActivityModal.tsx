'use client';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import styles from './StatsModals.module.css';
import type { StudentFieldProgress } from '@/lib/db/types';

interface WeeklyActivityModalProps {
  open: boolean;
  onClose: () => void;
  progress: StudentFieldProgress[];
}

export const WeeklyActivityModal = ({ open, onClose, progress }: WeeklyActivityModalProps) => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const weeklyActivity = progress.filter((p) => {
    const updatedAt = p.updated_at ? new Date(p.updated_at) : null;
    return updatedAt && updatedAt >= oneWeekAgo && p.status === 'mastered';
  });

  const getDayName = (date: Date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Dialog open={open} onClose={onClose} className={styles.dialog} maxWidth="sm" fullWidth>
      <DialogTitle className={styles.dialogTitle}>
        <span className={styles.titleText}>This Week&apos;s Activity</span>
        <span className={styles.titleSubtext}>{weeklyActivity.length} simulation{weeklyActivity.length !== 1 ? 's' : ''} completed</span>
      </DialogTitle>
      <DialogContent className={styles.dialogContent}>
        {weeklyActivity.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No simulations completed this week yet. Start exploring a career pathway to get started!</p>
          </div>
        ) : (
          <div className={styles.timelineContainer}>
            {weeklyActivity.map((activity, idx) => (
              <div key={activity.id} className={styles.timelineItem} style={{ animationDelay: `${idx * 50}ms` }}>
                <div className={styles.timelineMarker}>
                  <div className={styles.timelineDot}></div>
                  <div className={styles.timelineLine}></div>
                </div>
                <div className={styles.timelineContent}>
                  <div className={styles.timelineTitle}>{activity.field_id?.replace(/-/g, ' ').toUpperCase()}</div>
                  <div className={styles.timelineDate}>{formatDate(activity.updated_at || '')}</div>
                  <div className={styles.timelineStatus}>✓ Completed</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={styles.motivationalNote}>
          <strong>Keep it up!</strong> You&apos;re building a stronger understanding of different careers each week.
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
