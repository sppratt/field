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

interface TotalStudentsModalProps {
  open: boolean;
  onClose: () => void;
  students: Student[];
}

export const TotalStudentsModal = ({ open, onClose, students }: TotalStudentsModalProps) => {
  return (
    <Dialog open={open} onClose={onClose} className={styles.dialog} maxWidth="sm" fullWidth>
      <DialogTitle className={styles.dialogTitle}>
        <span className={styles.titleText}>Class Roster</span>
        <span className={styles.titleSubtext}>{students.length} student{students.length !== 1 ? 's' : ''} enrolled</span>
      </DialogTitle>
      <DialogContent className={styles.dialogContent}>
        <div className={styles.studentsList}>
          {students.map((student, idx) => (
            <div key={student.id} className={styles.studentItem} style={{ animationDelay: `${idx * 50}ms` }}>
              <div className={styles.studentHeader}>
                <span className={styles.studentInitial}>{student.name.charAt(0)}</span>
                <div className={styles.studentInfo}>
                  <span className={styles.studentName}>{student.name}</span>
                  <span className={styles.studentEmail}>{student.pathways_started} fields started</span>
                </div>
              </div>
              <div className={styles.studentStats}>
                <span className={`${styles.statusBadge} ${student.last_active ? styles.statusOnline : styles.statusOffline}`}>
                  {student.last_active ? 'Active' : 'Inactive'}
                </span>
                <span className={styles.progressIndicator}>{student.completion_percentage}%</span>
              </div>
            </div>
          ))}
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
