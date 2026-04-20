import { Modal, Button } from '@mui/material';
import type { StudentFieldProgress } from '@/lib/db/types';
import styles from '@/app/styles/modals/SkillMasteryModal.module.css';

const skillEmojis: Record<string, string> = {
  analytical: '🧠',
  creative: '🎨',
  hands_on: '🔧',
  social: '🤝',
  problem_solving: '🔍',
};

interface SkillMasteryModalProps {
  open: boolean;
  onClose: () => void;
  progress: StudentFieldProgress[];
}

export function SkillMasteryModal({ open, onClose, progress }: SkillMasteryModalProps) {
  // TODO: Fetch tag scores from student_level_attempts
  const tagScores = {
    analytical: 0,
    creative: 0,
    hands_on: 0,
    social: 0,
    problem_solving: 0,
  };

  const skills = Object.entries(tagScores)
    .sort(([, a], [, b]) => b - a)
    .map(([tag, score]) => ({
      name: tag.replace(/_/g, ' ').charAt(0).toUpperCase() + tag.slice(1).replace(/_/g, ' '),
      score,
      emoji: skillEmojis[tag] || '⭐',
    }));

  const topSkill = skills[0];

  return (
    <Modal open={open} onClose={onClose}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Skill Mastery Path</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className={styles.content}>
          <p className={styles.description}>
            See how your skills are developing across career explorations
          </p>

          {topSkill && topSkill.score > 0 && (
            <div className={styles.topStrengthSection}>
              <div className={styles.topStrengthLabel}>Your Top Strength</div>
              <div className={styles.topStrengthCard}>
                <div className={styles.topStrengthEmoji}>{topSkill.emoji}</div>
                <div className={styles.topStrengthName}>{topSkill.name}</div>
                <div className={styles.topStrengthScore}>{topSkill.score} points</div>
              </div>
            </div>
          )}

          <div className={styles.skillsGrid}>
            {skills.map((skill) => (
              <div key={skill.name} className={styles.skillCard}>
                <div className={styles.skillEmoji}>{skill.emoji}</div>
                <div className={styles.skillName}>{skill.name}</div>
                <div className={styles.skillScore}>{skill.score}</div>
                <div className={styles.skillBar}>
                  <div
                    className={styles.skillFill}
                    style={{ width: `${Math.min(skill.score * 20, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {skills.filter(s => s.score === 0).length > 0 && (
            <div className={styles.notice}>
              ⭐ Keep exploring to develop more skills!
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
