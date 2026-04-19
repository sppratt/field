'use client';

import styles from '@/app/styles/SimulationIntro.module.css';
import { Button } from './Button';

export interface SimulationIntroProps {
  title: string;
  introduction: string;
  onBegin: () => void;
}

export function SimulationIntro({ title, introduction, onBegin }: SimulationIntroProps) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.card}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.introduction}>{introduction}</p>
          <Button onClick={onBegin} variant="primary" size="large">
            Begin Scenario
          </Button>
        </div>
      </div>
    </div>
  );
}
