'use client';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import styles from './StatsModals.module.css';
import type { StudentFieldProgress } from '@/lib/db/types';

interface SkillsFoundModalProps {
  open: boolean;
  onClose: () => void;
  progress: StudentFieldProgress[];
}

const skillLabels: Record<string, string> = {
  analytical: 'Analytical Thinking',
  creative: 'Creative Expression',
  hands_on: 'Hands-On Learning',
  social: 'Social Impact',
  problem_solving: 'Problem Solving',
};

const skillEmojis: Record<string, string> = {
  analytical: '🧠',
  creative: '🎨',
  hands_on: '🔧',
  social: '🤝',
  problem_solving: '⚡',
};

export const SkillsFoundModal = ({ open, onClose, progress }: SkillsFoundModalProps) => {
  const getTagScores = () => {
    // TODO: Fetch tag scores from student_level_attempts
    // For now, return empty scores as we're using StudentFieldProgress
    return {
      analytical: 0,
      creative: 0,
      hands_on: 0,
      social: 0,
      problem_solving: 0,
    };
  };

  const tagScores = getTagScores();
  const discoveredCount = Object.values(tagScores).filter((score) => score > 0).length;
  const maxScore = Math.max(...Object.values(tagScores), 1);

  return (
    <Dialog open={open} onClose={onClose} className={styles.dialog} maxWidth="sm" fullWidth>
      <DialogTitle className={styles.dialogTitle}>
        <span className={styles.titleText}>Skills Discovered</span>
        <span className={styles.titleSubtext}>{discoveredCount} of 5 skills</span>
      </DialogTitle>
      <DialogContent className={styles.dialogContent}>
        <div className={styles.skillsList}>
          {Object.entries(skillLabels).map(([key, label], idx) => {
            const score = tagScores[key as keyof typeof tagScores] || 0;
            const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
            const isDiscovered = score > 0;

            return (
              <div key={key} className={styles.skillItem} style={{ animationDelay: `${idx * 60}ms` }}>
                <div className={styles.skillHeader}>
                  <div className={styles.skillLabel}>
                    <span className={styles.skillEmoji}>{skillEmojis[key]}</span>
                    <span className={styles.skillName}>{label}</span>
                  </div>
                  <span className={styles.skillScore}>{score > 0 ? `+${Math.round(score)}` : '—'}</span>
                </div>
                <div className={styles.skillBarContainer}>
                  <div className={styles.skillBar}>
                    <div
                      className={styles.skillBarFill}
                      style={{
                        width: `${isDiscovered ? percentage : 0}%`,
                        backgroundColor: isDiscovered ? 'var(--color-primary, #a8b8a0)' : '#e0e0e0',
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.skillsNote}>
          Complete more simulations to discover new skills and deepen existing ones.
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
