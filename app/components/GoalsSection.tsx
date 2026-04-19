'use client';

import React from 'react';
import styles from '@/app/styles/GoalsSection.module.css';

interface GoalsSectionProps {
  interests?: string;
  completedSimulations: number;
  totalPathways: number;
  topSkill?: string;
}

export function GoalsSection({
  interests,
  completedSimulations,
  totalPathways,
  topSkill,
}: GoalsSectionProps) {
  const completionPercentage = totalPathways > 0
    ? Math.round((completedSimulations / totalPathways) * 100)
    : 0;

  const getMilestoneMessage = () => {
    if (completedSimulations === 0) {
      return "Start your first simulation to begin tracking progress!";
    }
    if (completedSimulations === 1) {
      return "Great start! You've completed your first pathway.";
    }
    if (completedSimulations >= totalPathways && totalPathways > 0) {
      return "Amazing! You've completed all available pathways. 🎉";
    }
    return `You're ${completionPercentage}% through exploring all pathways.`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h2 className={styles.title}>Your Goals & Progress</h2>

        {interests && (
          <div className={styles.goalBox}>
            <div className={styles.goalLabel}>Career Interests</div>
            <p className={styles.goalText}>{interests}</p>
          </div>
        )}

        <div className={styles.progressContainer}>
          <div className={styles.progressLabel}>Pathway Completion</div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <div className={styles.progressStats}>
            <span>{completedSimulations}</span>
            <span>/</span>
            <span>{totalPathways}</span>
            <span className={styles.percentage}>{completionPercentage}%</span>
          </div>
        </div>

        <div className={styles.milestoneBox}>
          <div className={styles.milestoneIcon}>✨</div>
          <p className={styles.milestoneText}>{getMilestoneMessage()}</p>
        </div>

        {topSkill && (
          <div className={styles.skillBox}>
            <div className={styles.skillLabel}>Your Top Strength</div>
            <div className={styles.skillBadge}>{topSkill}</div>
            <p className={styles.skillText}>
              This strength aligns with several career paths. Keep exploring to find your best match!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
