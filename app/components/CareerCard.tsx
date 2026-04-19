'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import styles from '@/app/styles/CareerCard.module.css';

export interface CareerCardProps {
  id: string;
  title: string;
  description: string;
  level: 'intro' | 'intermediate' | 'advanced';
  keySkills: string[];
  icon: string;
  accentColor: string;

  // Optional - for dashboard
  progress?: number; // 0-100
  status?: 'not_started' | 'in_progress' | 'completed';
  isDashboard?: boolean;
  showTear?: boolean; // Only true on dashboard when progress > 0
}

export function CareerCard({
  id,
  title,
  description,
  level,
  keySkills,
  icon,
  accentColor,
  progress = 0,
  status = 'not_started',
  isDashboard = false,
  showTear = false,
}: CareerCardProps) {
  const href = `/pathways/${id}`;

  // Calculate tear intensity based on progress (only show on dashboard with progress)
  const tearIntensity = showTear && progress ? Math.ceil((progress / 100) * 3) : 0;
  const isBadgeVisible = isDashboard && progress > 0;

  const cardContent = (
    <div
      className={`${styles.card} ${styles[`card-${status}`]} ${styles[`tear-level-${tearIntensity}`]}`}
      style={{ '--card-accent': accentColor } as React.CSSProperties & { '--card-accent': string }}
    >
      {/* Front packet layer */}
      <div className={styles.packetFront}>
        <div className={styles.packetHeader}>
          <div className={styles.packetIcon}>{icon}</div>
          <div className={styles.packetHeaderContent}>
            <h3 className={styles.packetTitle}>{title}</h3>
            <span className={styles.levelBadge}>{level}</span>
          </div>
        </div>
      </div>

      {/* Torn/ripped edge SVG effect */}
      <svg className={styles.tearEdge} viewBox="0 0 100 20" preserveAspectRatio="none">
        <path d="M 0,5 Q 5,8 10,6 T 20,8 T 30,5 T 40,9 T 50,6 T 60,8 T 70,5 T 80,7 T 90,6 T 100,8 L 100,20 L 0,20 Z"
              fill="currentColor" />
      </svg>

      {/* Content layer (revealed underneath) */}
      <div className={styles.packetContent}>
        {/* Progress badge - visible when progress > 0 */}
        {isBadgeVisible && (
          <div className={styles.progressBadge}>
            {status === 'completed' ? '✓' : `${progress}%`}
          </div>
        )}

        {/* Description & Skills */}
        <p className={styles.description}>{description}</p>

        <div className={styles.skillPills}>
          {keySkills.slice(0, 3).map((skill) => (
            <span key={skill} className={styles.skillPill}>
              {skill}
            </span>
          ))}
        </div>

        {/* Dashboard progress bar */}
        {isDashboard && progress > 0 && (
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* CTA */}
        <span className={styles.cta}>
          {status === 'not_started' ? 'Start →' : status === 'completed' ? 'Revisit →' : 'Continue →'}
        </span>
      </div>
    </div>
  );

  return (
    <Link href={href} className={styles.linkWrapper}>
      {cardContent}
    </Link>
  );
}
