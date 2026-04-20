'use client';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import styles from './StatsModals.module.css';
import { careers } from '@/app/data/careers';
import type { StudentFieldProgress } from '@/lib/db/types';

interface PathwaysExploredModalProps {
  open: boolean;
  onClose: () => void;
  progress: StudentFieldProgress[];
}

export const PathwaysExploredModal = ({ open, onClose, progress }: PathwaysExploredModalProps) => {
  const exploredCareers = careers.filter((c) => progress.some((p) => p.field_id === c.id));

  const getStatus = (careerTitle: string) => {
    const careerProgress = progress.find((p) => p.field_id === careerTitle.toLowerCase());
    if (!careerProgress) return 'not_started';

    // Only mark as mastered if all 5 levels are completed AND status is mastered
    const allLevelsCompleted = careerProgress.levels_completed?.length === 5 &&
                               careerProgress.status === 'mastered';

    if (allLevelsCompleted) return 'mastered';

    // Show current status or in_progress if no status set
    const status = careerProgress.status || 'in_progress';
    return status === 'mastered' ? 'in_progress' : status;
  };

  const getPercentage = (careerTitle: string) => {
    const careerProgress = progress.find((p) => p.field_id === careerTitle.toLowerCase());
    if (!careerProgress) return 0;
    return (careerProgress.levels_completed?.length || 0) / 5 * 100;
  };

  const statusConfig = {
    not_started: { label: 'Not Started', color: '#999', bgColor: 'rgba(150, 150, 150, 0.1)' },
    in_progress: { label: 'In Progress', color: '#a8b8a0', bgColor: 'rgba(168, 184, 160, 0.1)' },
    mastered: { label: 'Mastered', color: '#7cb89f', bgColor: 'rgba(124, 184, 159, 0.1)' },
  };

  return (
    <Dialog open={open} onClose={onClose} className={styles.dialog} maxWidth="sm" fullWidth>
      <DialogTitle className={styles.dialogTitle}>
        <span className={styles.titleText}>Pathways Explored</span>
        <span className={styles.titleSubtext}>{exploredCareers.length} career{exploredCareers.length !== 1 ? 's' : ''}</span>
      </DialogTitle>
      <DialogContent className={styles.dialogContent}>
        <div className={styles.pathwaysList}>
          {exploredCareers.map((career, idx) => {
            const status = getStatus(career.id);
            const statusInfo = statusConfig[status as keyof typeof statusConfig];
            const percentage = getPercentage(career.id);

            return (
              <div key={career.id} className={styles.pathwayItem} style={{ animationDelay: `${idx * 50}ms` }}>
                <div className={styles.pathwayHeader}>
                  <span className={styles.pathwayTitle}>{career.title}</span>
                  {statusInfo && (
                    <span
                      className={styles.statusBadge}
                      style={{ color: statusInfo.color, backgroundColor: statusInfo.bgColor }}
                    >
                      {statusInfo.label}
                    </span>
                  )}
                </div>
                <div className={styles.progressBarContainer}>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${percentage}%`, backgroundColor: statusInfo?.color }}
                    />
                  </div>
                  <span className={styles.progressText}>{percentage}%</span>
                </div>
              </div>
            );
          })}
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
