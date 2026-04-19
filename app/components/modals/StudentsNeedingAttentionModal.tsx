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

interface StudentsNeedingAttentionModalProps {
  open: boolean;
  onClose: () => void;
  students: Student[];
}

export const StudentsNeedingAttentionModal = ({ open, onClose, students }: StudentsNeedingAttentionModalProps) => {
  const atRiskStudents = students.filter((s) => !s.last_active || s.pathways_started === 0);

  const getInterventionSuggestion = (student: Student) => {
    if (!student.last_active && student.pathways_started === 0) {
      return 'Send an invite to get started';
    }
    if (!student.last_active) {
      return 'Check in on their progress';
    }
    if (student.pathways_started === 0) {
      return 'Encourage them to explore a field';
    }
    return 'Monitor for engagement';
  };

  return (
    <Dialog open={open} onClose={onClose} className={styles.dialog} maxWidth="sm" fullWidth>
      <DialogTitle className={styles.dialogTitle}>
        <span className={styles.titleText}>Students Needing Attention</span>
        <span className={styles.titleSubtext}>{atRiskStudents.length} student{atRiskStudents.length !== 1 ? 's' : ''} need support</span>
      </DialogTitle>
      <DialogContent className={styles.dialogContent}>
        {atRiskStudents.length === 0 ? (
          <div className={styles.emptyMessage}>
            <p>🎉 All students are engaged! Great work encouraging exploration.</p>
          </div>
        ) : (
          <div className={styles.attentionList}>
            {atRiskStudents.map((student, idx) => (
              <div key={student.id} className={styles.attentionItem} style={{ animationDelay: `${idx * 50}ms` }}>
                <div className={styles.attentionStatus}>
                  <span className={styles.attentionWarning}>⚠️</span>
                  <div>
                    <div className={styles.attentionName}>{student.name}</div>
                    <div className={styles.attentionReason}>
                      {!student.last_active && student.pathways_started === 0 && 'Not started & inactive'}
                      {!student.last_active && student.pathways_started > 0 && 'Inactive'}
                      {student.pathways_started === 0 && student.last_active && 'Inactive'}
                    </div>
                  </div>
                </div>
                <div className={styles.attentionSuggestion}>{getInterventionSuggestion(student)}</div>
              </div>
            ))}
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
