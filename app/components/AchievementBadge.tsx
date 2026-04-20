import styles from '@/app/styles/AchievementBadge.module.css';
import type { AchievementType } from '@/lib/db/types';

interface AchievementInfo {
  type: AchievementType;
  emoji: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedDate?: string;
}

const achievementMap: Record<AchievementType, Omit<AchievementInfo, 'unlocked' | 'unlockedDate'>> = {
  first_explorer: {
    type: 'first_explorer',
    emoji: '🚀',
    title: 'First Explorer',
    description: 'You started your first pathway',
  },
  thorough_investigator: {
    type: 'thorough_investigator',
    emoji: '🔬',
    title: 'Thorough Investigator',
    description: 'You explored all 5 career fields',
  },
  skill_specialist_analytical: {
    type: 'skill_specialist_analytical',
    emoji: '🧠',
    title: 'Analytical Specialist',
    description: 'You mastered analytical thinking',
  },
  skill_specialist_creative: {
    type: 'skill_specialist_creative',
    emoji: '🎨',
    title: 'Creative Master',
    description: 'You mastered creative thinking',
  },
  skill_specialist_hands_on: {
    type: 'skill_specialist_hands_on',
    emoji: '🔧',
    title: 'Hands-on Expert',
    description: 'You mastered hands-on skills',
  },
  skill_specialist_social: {
    type: 'skill_specialist_social',
    emoji: '🤝',
    title: 'Social Butterfly',
    description: 'You mastered social skills',
  },
  skill_specialist_problem_solving: {
    type: 'skill_specialist_problem_solving',
    emoji: '🔍',
    title: 'Problem Solver',
    description: 'You mastered problem-solving',
  },
  balanced_learner: {
    type: 'balanced_learner',
    emoji: '⚖️',
    title: 'Balanced Learner',
    description: 'You developed all skills equally',
  },
  committed_explorer: {
    type: 'committed_explorer',
    emoji: '✨',
    title: 'Committed Explorer',
    description: 'You completed 3+ pathways',
  },
};

interface AchievementBadgeProps {
  type: AchievementType;
  unlocked: boolean;
  unlockedDate?: string;
  size?: 'small' | 'medium' | 'large';
}

export function AchievementBadge({
  type,
  unlocked,
  unlockedDate,
  size = 'medium',
}: AchievementBadgeProps) {
  const info = achievementMap[type];

  return (
    <div className={`${styles.badge} ${styles[size]} ${!unlocked ? styles.locked : ''}`}>
      <div className={styles.emoji}>{info.emoji}</div>
      <h3 className={styles.title}>{info.title}</h3>
      <p className={styles.description}>{info.description}</p>
      {unlocked && unlockedDate && (
        <p className={styles.date}>{new Date(unlockedDate).toLocaleDateString()}</p>
      )}
      {!unlocked && <div className={styles.lockIcon}>🔒</div>}
    </div>
  );
}
