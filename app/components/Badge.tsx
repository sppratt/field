'use client';

import React from 'react';
import styles from '@/app/styles/Badge.module.css';

interface BadgeProps {
  label: string;
  variant?: 'completed' | 'inProgress' | 'attempted' | 'notStarted' | 'active';
  icon?: React.ReactNode;
}

export function Badge({ label, variant = 'active', icon }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      {icon && <span>{icon}</span>}
      {label}
    </span>
  );
}
