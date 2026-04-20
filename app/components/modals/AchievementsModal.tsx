'use client';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import styles from './StatsModals.module.css';
import { AchievementBadge } from '../AchievementBadge';
import type { StudentAchievement, AchievementType } from '@/lib/db/types';

interface AchievementsModalProps {
  open: boolean;
  onClose: () => void;
  achievements: StudentAchievement[];
}

const allAchievementTypes: AchievementType[] = [
  'first_explorer',
  'thorough_investigator',
  'skill_specialist_analytical',
  'skill_specialist_creative',
  'skill_specialist_hands_on',
  'skill_specialist_social',
  'skill_specialist_problem_solving',
  'balanced_learner',
  'committed_explorer',
];

export const AchievementsModal = ({ open, onClose, achievements }: AchievementsModalProps) => {
  const earnedTypes = new Set(achievements.map(a => a.achievement_type));
  const achievementMap = new Map(achievements.map(a => [a.achievement_type, a]));

  return (
    <Dialog open={open} onClose={onClose} className={styles.dialog} maxWidth="md" fullWidth>
      <DialogTitle className={styles.dialogTitle}>
        <span className={styles.titleText}>Achievements</span>
        <span className={styles.titleSubtext}>
          {earnedTypes.size} of {allAchievementTypes.length} unlocked
        </span>
      </DialogTitle>
      <DialogContent className={styles.dialogContent}>
        <div className={styles.achievementsGrid}>
          {allAchievementTypes.map((type, idx) => {
            const achievement = achievementMap.get(type);
            return (
              <div
                key={type}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <AchievementBadge
                  type={type}
                  unlocked={earnedTypes.has(type)}
                  unlockedDate={achievement?.earned_at}
                  size="medium"
                />
              </div>
            );
          })}
        </div>

        {earnedTypes.size === allAchievementTypes.length && (
          <div className={styles.celebrationBox}>
            <p>🎉 Amazing! You&apos;ve earned all achievements! You&apos;re a true career explorer!</p>
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
