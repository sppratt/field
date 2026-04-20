'use client';

import { useState } from 'react';
import type { StudentFieldProgress, StudentAchievement, StudentChallenge } from '@/lib/db/types';
import styles from '@/app/styles/DashboardStatsCards.module.css';

interface DashboardStatsCardsProps {
  progress: StudentFieldProgress[];
  achievements: StudentAchievement[];
  challenges: StudentChallenge[];
  onOpenGoals?: () => void;
  onOpenSkills?: () => void;
  onOpenAchievements?: () => void;
  onOpenCareers?: () => void;
  onOpenChallenges?: () => void;
}

export function DashboardStatsCards({
  progress,
  achievements,
  challenges,
  onOpenGoals,
  onOpenSkills,
  onOpenAchievements,
  onOpenCareers,
  onOpenChallenges,
}: DashboardStatsCardsProps) {
  const getProgressPercentage = () => {
    if (progress.length === 0) return 0;
    const mastered = progress.filter(p => p.status === 'mastered').length;
    return Math.round((mastered / progress.length) * 100);
  };

  const getTopSkill = () => {
    // TODO: Fetch tag scores from student_level_attempts
    return null;
  };

  const getSkillCount = () => {
    // TODO: Fetch tag scores from student_level_attempts
    return 0;
  };

  const pathwayCompletion = getProgressPercentage();
  const topSkill = getTopSkill();
  const skillCount = getSkillCount();

  return (
    <div className={styles.container}>
      {/* Goals Card */}
      <button className={styles.card} onClick={onOpenGoals}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Goals</span>
        </div>
        <div className={styles.cardContent}>
          <div className={styles.statValue}>{progress.length}/5</div>
          <div className={styles.statLabel}>Pathways</div>
          <div className={styles.progress}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${pathwayCompletion}%` }}
              />
            </div>
            <div className={styles.progressText}>{pathwayCompletion}%</div>
          </div>
          <div className={styles.cardHintRow}>
            <span>See details</span>
            <span className={styles.arrow}>→</span>
          </div>
        </div>
      </button>

      {/* Skill Mastery Card */}
      <button className={styles.card} onClick={onOpenSkills}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Skills</span>
        </div>
        <div className={styles.cardContent}>
          <div className={styles.statValue}>{skillCount}</div>
          <div className={styles.statLabel}>Skills Found</div>
          <div className={styles.cardHintRow}>
            <span>{skillCount > 0 ? 'Keep growing' : 'Start exploring'}</span>
            <span className={styles.arrow}>→</span>
          </div>
        </div>
      </button>

      {/* Achievements Card */}
      <button className={styles.card} onClick={onOpenAchievements}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Achievements</span>
        </div>
        <div className={styles.cardContent}>
          <div className={styles.statValue}>{achievements.length}</div>
          <div className={styles.statLabel}>Unlocked</div>
          <div className={styles.cardHintRow}>
            <span>{achievements.length > 0 ? 'Great job!' : 'Earn badges'}</span>
            <span className={styles.arrow}>→</span>
          </div>
        </div>
      </button>

      {/* Career Matches Card */}
      <button className={styles.card} onClick={onOpenCareers}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Matches</span>
        </div>
        <div className={styles.cardContent}>
          <div className={styles.statValue}>📊</div>
          <div className={styles.statLabel}>Career Rankings</div>
          <div className={styles.cardHintRow}>
            <span>{progress.length > 0 ? 'View all' : 'Not ready'}</span>
            <span className={styles.arrow}>→</span>
          </div>
        </div>
      </button>

      {/* Weekly Challenges Card */}
      <button className={styles.card} onClick={onOpenChallenges}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Challenges</span>
        </div>
        <div className={styles.cardContent}>
          <div className={styles.statValue}>{challenges.length}</div>
          <div className={styles.statLabel}>This Week</div>
          <div className={styles.cardHintRow}>
            <span>{challenges.length > 0 ? 'Do more' : 'Check back'}</span>
            <span className={styles.arrow}>→</span>
          </div>
        </div>
      </button>
    </div>
  );
}
