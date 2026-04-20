'use client';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import styles from './StatsModals.module.css';
import { careers } from '@/app/data/careers';
import { rankCareersForStudent } from '@/app/utils/careerMatching';
import type { SkillScores } from '@/app/utils/skillScoring';

interface CareerMatchRankingsModalProps {
  open: boolean;
  onClose: () => void;
  skillScores: SkillScores;
}

const careerIcons: Record<string, string> = {
  'software-engineer': '⚙️',
  'nurse': '💊',
  'graphic-designer': '🎨',
  'data-analyst': '📊',
  'architect': '🏗️',
};

export const CareerMatchRankingsModal = ({
  open,
  onClose,
  skillScores,
}: CareerMatchRankingsModalProps) => {
  const rankedCareers = rankCareersForStudent(careers, skillScores);

  return (
    <Dialog open={open} onClose={onClose} className={styles.dialog} maxWidth="sm" fullWidth>
      <DialogTitle className={styles.dialogTitle}>
        <span className={styles.titleText}>Career Match Rankings</span>
        <span className={styles.titleSubtext}>Based on your skill development</span>
      </DialogTitle>
      <DialogContent className={styles.dialogContent}>
        <div className={styles.rankingsContainer}>
          {rankedCareers.map((match, idx) => (
            <div key={match.career.id} className={styles.rankingItem} style={{ animationDelay: `${idx * 60}ms` }}>
              <div className={styles.rankingHeader}>
                <span className={styles.rankNumber}>#{idx + 1}</span>
                <span className={styles.careerIcon}>{careerIcons[match.career.id] || '💼'}</span>
                <span className={styles.careerTitle}>{match.career.title}</span>
                <span className={styles.matchBadge}>{match.matchPercentage}%</span>
              </div>
              <div className={styles.matchBar}>
                <div
                  className={styles.matchFill}
                  style={{ width: `${match.matchPercentage}%` }}
                />
              </div>
              <p className={styles.reasoning}>{match.reasoning}</p>
            </div>
          ))}
        </div>

        <div className={styles.tipsBox}>
          <p>
            💡 These rankings update as you explore more pathways and develop new skills. Keep
            exploring to discover your true career passion!
          </p>
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
