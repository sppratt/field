'use client';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import styles from './StatsModals.module.css';
import type { Career } from '@/app/data/careers';
import type { StudentProgress } from '@/lib/db/types';

interface CareerCalculationModalProps {
  open: boolean;
  onClose: () => void;
  career: Career | null;
  progress: StudentProgress[];
}

export const CareerCalculationModal = ({ open, onClose, career, progress }: CareerCalculationModalProps) => {
  const getTagScores = () => {
    const tagScores: Record<string, number> = {
      analytical: 0,
      creative: 0,
      hands_on: 0,
      social: 0,
      problem_solving: 0,
    };

    progress.forEach((p) => {
      if (p.status === 'completed' || p.status === 'in_progress') {
        try {
          const tagScoresJson = p.decisions_made?.tagScores_json;
          if (tagScoresJson) {
            const scores = typeof tagScoresJson === 'string' ? JSON.parse(tagScoresJson) : tagScoresJson;
            Object.keys(scores).forEach((tag) => {
              if (tag in tagScores) {
                tagScores[tag] += scores[tag] || 0;
              }
            });
          }
        } catch (err) {
          console.error('Error parsing tag scores:', err);
        }
      }
    });

    return tagScores;
  };

  const tagScores = getTagScores();

  if (!career) return null;

  const matchScore = career.recommendationTags.reduce((sum, tag) => sum + (tagScores[tag as keyof typeof tagScores] || 0), 0);
  const maxPossibleScore = career.recommendationTags.length * 10;
  const matchPercentage = maxPossibleScore > 0 ? Math.round((matchScore / maxPossibleScore) * 100) : 0;

  return (
    <Dialog open={open} onClose={onClose} className={styles.dialog} maxWidth="sm" fullWidth>
      <DialogTitle className={styles.dialogTitle}>
        <span className={styles.titleText}>How We Calculated This</span>
        <span className={styles.titleSubtext}>{career.title}</span>
      </DialogTitle>
      <DialogContent className={styles.dialogContent}>
        <div className={styles.calculationSection}>
          <div className={styles.matchPercentage}>
            <div className={styles.matchCircle}>
              <span className={styles.matchPercent}>{matchPercentage}%</span>
            </div>
            <p className={styles.matchExplanation}>This is your compatibility score based on your skill profile from completed simulations.</p>
          </div>

          <div className={styles.skillsBreakdown}>
            <h3 className={styles.sectionHeading}>Skills this career values:</h3>
            <div className={styles.skillsGrid}>
              {career.recommendationTags.map((tag, idx) => {
                const score = tagScores[tag as keyof typeof tagScores] || 0;
                return (
                  <div key={tag} className={styles.skillBreakdownItem} style={{ animationDelay: `${idx * 40}ms` }}>
                    <div className={styles.skillBreakdownLabel}>{tag.replace(/_/g, ' ')}</div>
                    <div className={styles.skillBreakdownBar}>
                      <div
                        className={styles.skillBreakdownFill}
                        style={{ width: `${Math.min((score / 10) * 100, 100)}%` }}
                      />
                    </div>
                    <div className={styles.skillBreakdownScore}>+{score}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={styles.note}>
            <strong>Note:</strong> This match is calculated from your decisions in career simulations. The more simulations you complete, the more accurate this becomes!
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
