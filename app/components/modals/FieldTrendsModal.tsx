'use client';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import styles from './TeacherModals.module.css';

interface FieldTrendsModalProps {
  open: boolean;
  onClose: () => void;
  mostExplored: string;
  leastExplored: string;
}

const fieldEmojis: Record<string, string> = {
  'Software Engineer': '⚙️',
  'Nurse': '💊',
  'Graphic Designer': '🎨',
  'Data Analyst': '📊',
  'Architect': '🏗️',
};

export const FieldTrendsModal = ({ open, onClose, mostExplored, leastExplored }: FieldTrendsModalProps) => {
  return (
    <Dialog open={open} onClose={onClose} className={styles.dialog} maxWidth="sm" fullWidth>
      <DialogTitle className={styles.dialogTitle}>
        <span className={styles.titleText}>Field Trends</span>
        <span className={styles.titleSubtext}>Class exploration patterns</span>
      </DialogTitle>
      <DialogContent className={styles.dialogContent}>
        <div className={styles.trendsContainer}>
          <div className={styles.trendCard} style={{ animationDelay: '0ms' }}>
            <div className={styles.trendLabel}>Most Explored</div>
            <div className={styles.trendEmoji}>{fieldEmojis[mostExplored] || '🎯'}</div>
            <div className={styles.trendName}>{mostExplored}</div>
            <div className={styles.trendDescription}>Your class shows strong interest in this career path</div>
            <div className={styles.trendAction}>Consider assigning related simulations to deepen learning</div>
          </div>

          <div className={styles.trendCard} style={{ animationDelay: '80ms' }}>
            <div className={styles.trendLabel}>Least Explored</div>
            <div className={styles.trendEmoji}>{fieldEmojis[leastExplored] || '🔍'}</div>
            <div className={styles.trendName}>{leastExplored}</div>
            <div className={styles.trendDescription}>This pathway may need more exposure</div>
            <div className={styles.trendAction}>Try introducing this field through discussion or assignment</div>
          </div>
        </div>

        <div className={styles.trendInsight}>
          <strong>Teacher Insight:</strong> Diversity of career exploration is important for student growth. Encourage students to step outside their comfort zone.
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
