'use client';

import React from 'react';
import styles from '@/app/styles/Callout.module.css';

interface CalloutProps {
  title?: string;
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  icon?: React.ReactNode;
}

export function Callout({
  title,
  children,
  variant = 'info',
  icon,
}: CalloutProps) {
  return (
    <div className={`${styles.callout} ${styles[`callout${variant.charAt(0).toUpperCase() + variant.slice(1)}`]}`}>
      {title && <div className={styles.calloutTitle}>{icon && <span style={{ marginRight: '0.5rem' }}>{icon}</span>}{title}</div>}
      <div className={styles.calloutText}>{children}</div>
    </div>
  );
}
