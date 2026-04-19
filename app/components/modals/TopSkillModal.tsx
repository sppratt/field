'use client';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import styles from './StatsModals.module.css';
import { careers } from '@/app/data/careers';
import type { StudentProgress } from '@/lib/db/types';

interface TopSkillModalProps {
  open: boolean;
  onClose: () => void;
  topSkill: string | null;
  progress: StudentProgress[];
}

const skillDescriptions: Record<string, string> = {
  analytical: 'You excel at breaking down complex problems and thinking logically. Your strong analytical skills suggest careers requiring data analysis, research, or strategic planning.',
  creative: 'You have a talent for original thinking and artistic expression. Your creative skills open doors to careers in design, innovation, content creation, and storytelling.',
  hands_on: 'You prefer learning by doing and building things. Your hands-on approach is perfect for careers in engineering, trades, fabrication, and practical problem-solving.',
  social: 'You naturally connect with others and care about their wellbeing. Your social skills are ideal for careers in education, healthcare, counseling, and community work.',
  problem_solving: 'You enjoy tackling challenges and finding solutions. Your problem-solving mindset is valuable in tech, engineering, consulting, and any field requiring innovation.',
};

export const TopSkillModal = ({ open, onClose, topSkill, progress }: TopSkillModalProps) => {
  const matchingCareers = topSkill
    ? careers.filter((c) => c.recommendationTags.includes(topSkill as any))
    : [];

  const skillLabel = topSkill ? topSkill.replace(/_/g, ' ').toLowerCase() : '';

  return (
    <Dialog open={open} onClose={onClose} className={styles.dialog} maxWidth="sm" fullWidth>
      <DialogTitle className={styles.dialogTitle}>
        <span className={styles.titleText}>{topSkill ? topSkill.charAt(0).toUpperCase() + topSkill.slice(1).replace(/_/g, ' ') : 'Top Skill'}</span>
        <span className={styles.titleSubtext}>Your strongest skill</span>
      </DialogTitle>
      <DialogContent className={styles.dialogContent}>
        <div className={styles.skillDescription}>
          <p>{topSkill ? skillDescriptions[topSkill as keyof typeof skillDescriptions] : ''}</p>
        </div>

        <div className={styles.matchingCareersSection}>
          <h3 className={styles.sectionHeading}>Careers that value this skill:</h3>
          <div className={styles.careersList}>
            {matchingCareers.map((career, idx) => (
              <div key={career.id} className={styles.careerMatch} style={{ animationDelay: `${idx * 50}ms` }}>
                <span className={styles.careerMatchIcon}>→</span>
                <span className={styles.careerMatchName}>{career.title}</span>
              </div>
            ))}
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
