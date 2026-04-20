'use client';

import styles from '@/app/styles/SkillMasterySection.module.css';
import { getAggregateTagScores, getSkillLabel, getSkillEmoji, SkillTag } from '@/app/utils/skillScoring';
import type { StudentProgress } from '@/lib/db/types';

interface SkillMasterySectionProps {
  progress: StudentProgress[];
}

const skillOrder: SkillTag[] = ['analytical', 'creative', 'hands_on', 'social', 'problem_solving'];

export function SkillMasterySection({ progress }: SkillMasterySectionProps) {
  const skillScores = getAggregateTagScores(progress);

  // Calculate max score for normalization
  const maxScore = Math.max(...Object.values(skillScores), 10);
  const totalScore = Object.values(skillScores).reduce((sum, val) => sum + val, 0);

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h2 className={styles.title}>Skill Mastery Path</h2>
        <p className={styles.description}>
          See how your skills are developing across career explorations
        </p>

        <div className={styles.skillsGrid}>
          {skillOrder.map((skill, idx) => {
            const score = skillScores[skill];
            const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

            return (
              <div key={skill} className={styles.skillItem} style={{ animationDelay: `${idx * 100}ms` }}>
                <div className={styles.skillHeader}>
                  <span className={styles.skillEmoji}>{getSkillEmoji(skill)}</span>
                  <span className={styles.skillName}>{getSkillLabel(skill)}</span>
                  <span className={styles.skillScore}>{Math.round(score)}</span>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {totalScore > 0 && (
          <div className={styles.insight}>
            <p>
              {totalScore > 30
                ? '🔥 You\'re building strong skills across multiple areas!'
                : totalScore > 15
                  ? '⭐ Keep exploring to develop more skills!'
                  : '🌱 You\'re just getting started—complete more pathways to grow your skills!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
