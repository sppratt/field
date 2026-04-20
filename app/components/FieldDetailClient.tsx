'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { StudentFieldProgress } from '@/lib/db/types';
import FieldLevelProgress from '@/app/components/FieldLevelProgress';
import Button from '@/app/components/Button';
import styles from '@/app/styles/FieldDetail.module.css';

interface FieldInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface FieldDetailClientProps {
  field: FieldInfo;
}

const FIELD_DETAILS: Record<string, FieldInfo> = {
  'software-engineer': {
    id: 'software-engineer',
    name: 'Software Engineer',
    icon: '⚙️',
    description:
      'Learn to build scalable systems, make architectural decisions, and lead technical teams. Navigate the complexities of modern software development through decision-based scenarios that mirror real career challenges.',
  },
  'nurse': {
    id: 'nurse',
    name: 'Nurse',
    icon: '💊',
    description:
      'Develop critical care skills, patient advocacy, and clinical judgment. Progress from bedside basics to leadership roles in healthcare innovation and system improvement.',
  },
  'graphic-designer': {
    id: 'graphic-designer',
    name: 'Graphic Designer',
    icon: '🎨',
    description:
      'Build design systems, lead creative teams, and shape how brands communicate. Experience the full journey from creative execution to strategic design leadership.',
  },
  'data-analyst': {
    id: 'data-analyst',
    name: 'Data Analyst',
    icon: '📊',
    description:
      'Transform data into insights that drive decisions. Progress from data interpretation to influencing organizational strategy with ethics-first thinking.',
  },
  'architect': {
    id: 'architect',
    name: 'Architect',
    icon: '🏗️',
    description:
      'Design spaces that serve people and communities. Navigate from design execution to master planning, balancing vision, sustainability, and human needs.',
  },
};

export default function FieldDetailClient({ field }: FieldDetailClientProps) {
  const router = useRouter();
  const [progress, setProgress] = useState<StudentFieldProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fieldInfo = FIELD_DETAILS[field.id] || field;

  const loadFieldProgress = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/field-progress', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to load progress');

      const data = await response.json();
      const fieldProgress = data.fields?.find(
        (f: StudentFieldProgress) => f.field_id === field.id
      );
      setProgress(fieldProgress || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [field.id]);

  useEffect(() => {
    loadFieldProgress();
  }, [loadFieldProgress]);

  const handleStartField = async () => {
    try {
      const response = await fetch('/api/field-progress', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fieldId: field.id }),
      });

      if (!response.ok) throw new Error('Failed to start field');

      loadFieldProgress();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleStartLevel = (level: number) => {
    router.push(`/fields/${field.id}/level/${level}`);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <p className={styles.loadingMessage}>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/pathways">
          <Button variant="secondary">← Back to All Fields</Button>
        </Link>
      </div>

      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroIcon}>{fieldInfo.icon}</div>
        <h1 className={styles.title}>{fieldInfo.name}</h1>
        <p className={styles.description}>{fieldInfo.description}</p>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {/* Progress Section */}
      {progress ? (
        <div className={styles.progressSection}>
          <h2>Your Progress</h2>
          <FieldLevelProgress
            fieldName={fieldInfo.name}
            progress={progress}
            onStartLevel={handleStartLevel}
          />

          {progress.status === 'mastered' && (
            <div className={styles.masteredMessage}>
              <h3>🌟 You&apos;ve Mastered {fieldInfo.name}!</h3>
              <p>
                You&apos;ve completed all 5 levels and developed deep expertise in this field. Great
                work!
              </p>
              <Link href="/dashboard">
                <Button variant="primary">Back to Dashboard</Button>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.startSection}>
          <h2>Ready to Explore?</h2>
          <p>
            Complete 5 progressive levels in {fieldInfo.name}. Each level builds on the previous,
            with increasingly complex scenarios and decisions.
          </p>

          <div className={styles.levelPreview}>
            <div className={styles.levelItem}>
              <span className={styles.levelName}>Level 1</span>
              <span className={styles.levelDesc}>Foundation</span>
            </div>
            <span className={styles.arrow}>→</span>
            <div className={styles.levelItem}>
              <span className={styles.levelName}>Level 2</span>
              <span className={styles.levelDesc}>Application</span>
            </div>
            <span className={styles.arrow}>→</span>
            <div className={styles.levelItem}>
              <span className={styles.levelName}>Level 5</span>
              <span className={styles.levelDesc}>Expert</span>
            </div>
          </div>

          <Button onClick={handleStartField} size="large" className={styles.startButton}>
            Start {fieldInfo.name} → Level 1
          </Button>
        </div>
      )}

      {/* Info Section */}
      <div className={styles.infoSection}>
        <h2>How It Works</h2>
        <div className={styles.infoGrid}>
          <div className={styles.infoBox}>
            <div className={styles.infoIcon}>📚</div>
            <h3>Progressive Levels</h3>
            <p>Start with foundational scenarios and progress to expert-level decision-making.</p>
          </div>
          <div className={styles.infoBox}>
            <div className={styles.infoIcon}>🎯</div>
            <h3>Mastery-Based Unlocking</h3>
            <p>Score 75% or higher to unlock the next level. Retry anytime to improve.</p>
          </div>
          <div className={styles.infoBox}>
            <div className={styles.infoIcon}>💡</div>
            <h3>Real-World Scenarios</h3>
            <p>Make meaningful choices that reflect actual career challenges and growth.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
