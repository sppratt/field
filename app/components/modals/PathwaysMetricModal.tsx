'use client';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import styles from './TeacherModals.module.css';

interface Student {
  id: string;
  name: string;
  pathways_started: number;
  pathways_completed: number;
  completion_percentage: number;
  last_active: string | null;
}

interface PathwaysMetricModalProps {
  open: boolean;
  onClose: () => void;
  students: Student[];
  type: 'started' | 'completed';
  totalCount: number;
}

export const PathwaysMetricModal = ({ open, onClose, students, type, totalCount }: PathwaysMetricModalProps) => {
  const metric = type === 'started' ? 'pathways_started' : 'pathways_completed';
  const studentsWithMetric = students.filter((s) => Number(s[metric as keyof Student] ?? 0) > 0);

  const title = type === 'started' ? 'Fields Started' : 'Simulations Completed';
  const subtitle = type === 'started' ? `${totalCount} total across class` : `${totalCount} total completed`;

  return (
    <Dialog open={open} onClose={onClose} className={styles.dialog} maxWidth="sm" fullWidth>
      <DialogTitle className={styles.dialogTitle}>
        <span className={styles.titleText}>{title}</span>
        <span className={styles.titleSubtext}>{subtitle}</span>
      </DialogTitle>
      <DialogContent className={styles.dialogContent}>
        <div className={styles.metricsGrid}>
          {studentsWithMetric.map((student, idx) => (
            <div key={student.id} className={styles.metricCard} style={{ animationDelay: `${idx * 40}ms` }}>
              <div className={styles.metricHeader}>
                <span className={styles.metricStudent}>{student.name}</span>
                <span className={styles.metricValue}>{student[metric as keyof Student]}</span>
              </div>
              <div className={styles.metricBar}>
                <div
                  className={styles.metricBarFill}
                  style={{
                    width: `${Math.min((Number(student[metric as keyof Student]) / 5) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {studentsWithMetric.length === 0 && (
          <div className={styles.emptyMessage}>
            <p>No students have {type === 'started' ? 'started any fields' : 'completed any simulations'} yet.</p>
          </div>
        )}
      </DialogContent>
      <DialogActions className={styles.dialogActions}>
        <Button onClick={onClose} variant="outlined" className={styles.button}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
