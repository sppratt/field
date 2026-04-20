'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { StudentFieldProgress } from '@/lib/db/types';
import FieldLevelProgress from '@/app/components/FieldLevelProgress';
import styles from './StudentDashboard.module.css';
import Button from '@/app/components/Button';

const FIELDS = [
  { id: 'software-engineer', name: 'Software Engineer', icon: '⚙️' },
  { id: 'nurse', name: 'Nurse', icon: '💊' },
  { id: 'graphic-designer', name: 'Graphic Designer', icon: '🎨' },
  { id: 'data-analyst', name: 'Data Analyst', icon: '📊' },
  { id: 'architect', name: 'Architect', icon: '🏗️' },
];

interface Insights {
  topSkills: Array<{ tag: string; score: number }>;
  emergingStrengths: Array<{ tag: string; velocity: number; trend: string }>;
  velocity?: Record<string, number>;
  patterns?: Record<string, number>;
}

export default function StudentDashboardNew() {
  const router = useRouter();
  const [fieldProgress, setFieldProgress] = useState<StudentFieldProgress[]>([]);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch field progress
      const progressRes = await fetch('/api/field-progress');
      if (!progressRes.ok) throw new Error('Failed to load field progress');
      const progressData = await progressRes.json();
      setFieldProgress(progressData.fields || []);

      // Fetch analytics insights
      const strengthsRes = await fetch('/api/analytics/strengths');
      if (strengthsRes.ok) {
        const strengthsData = await strengthsRes.json();
        setInsights(strengthsData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getFieldInfo = (fieldId: string) => {
    return FIELDS.find(f => f.id === fieldId) || { name: fieldId, icon: '🎯' };
  };

  const inProgressFields = fieldProgress.filter(f => f.status === 'in_progress');
  const masteredFields = fieldProgress.filter(f => f.status === 'mastered');
  const notStartedFields = fieldProgress.filter(f => f.status === 'not_started');

  const handleStartField = async (fieldId: string) => {
    try {
      const res = await fetch('/api/field-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fieldId }),
      });

      if (res.ok) {
        loadDashboardData();
      }
    } catch (err) {
      console.error('Error starting field:', err);
    }
  };

  if (loading) {
    return <div className={styles.container}><p>Loading...</p></div>;
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1>Your Learning Journey</h1>
        <p>Explore fields, build skills, unlock potential</p>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {/* Quick Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.stat}>
          <div className={styles.statLabel}>In Progress</div>
          <div className={styles.statValue}>{inProgressFields.length}</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Mastered</div>
          <div className={styles.statValue}>{masteredFields.length}</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Levels Complete</div>
          <div className={styles.statValue}>
            {fieldProgress.reduce((sum, f) => sum + f.levels_completed.length, 0)}
          </div>
        </div>
      </div>

      {/* Active Fields */}
      {inProgressFields.length > 0 && (
        <section className={styles.section}>
          <h2>Continue Your Journey</h2>
          <div className={styles.fieldsGrid}>
            {inProgressFields.map(progress => {
              const fieldInfo = getFieldInfo(progress.field_id);
              return (
                <div key={progress.field_id} className={styles.fieldCard}>
                  <div className={styles.fieldIcon}>{fieldInfo.icon}</div>
                  <h3>{fieldInfo.name}</h3>
                  <FieldLevelProgress
                    fieldName={fieldInfo.name}
                    progress={progress}
                    onStartLevel={(level) => {
                      // Navigate to quiz flow
                      router.push(
                        `/fields/${progress.field_id}/level/${level}/quiz`
                      );
                    }}
                  />
                  <Link href={`/fields/${progress.field_id}`}>
                    <Button variant="secondary" size="small">
                      Open
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Learning Insights */}
      {insights && (
        <section className={styles.section}>
          <h2>Your Insights</h2>

          <div className={styles.insightsGrid}>
            {/* Top Skills */}
            <div className={styles.insightBox}>
              <h3>🏆 Top Skills</h3>
              {insights.topSkills && insights.topSkills.length > 0 ? (
                <ul className={styles.skillsList}>
                  {insights.topSkills.slice(0, 3).map(skill => (
                    <li key={skill.tag}>
                      <span className={styles.skillName}>{skill.tag}</span>
                      <span className={styles.skillScore}>{Math.round(skill.score)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.emptyMessage}>Start a quiz to build your skills</p>
              )}
            </div>

            {/* Emerging Strengths */}
            {insights.emergingStrengths && insights.emergingStrengths.length > 0 && (
              <div className={styles.insightBox}>
                <h3>📈 Trending Up</h3>
                <ul className={styles.skillsList}>
                  {insights.emergingStrengths.slice(0, 3).map(skill => (
                    <li key={skill.tag}>
                      <span className={styles.skillName}>{skill.tag}</span>
                      <span className={styles.trend}>{skill.trend === 'increasing' ? '↗' : '↘'}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendation */}
            <div className={styles.insightBox}>
              <h3>💡 Recommendation</h3>
              {notStartedFields.length > 0 ? (
                <div>
                  <p className={styles.recommendText}>
                    Based on your skills, consider exploring:
                  </p>
                  {notStartedFields.slice(0, 2).map(field => {
                    const fieldInfo = getFieldInfo(field.field_id);
                    return (
                      <Button
                        key={field.field_id}
                        variant="secondary"
                        size="small"
                        onClick={() => handleStartField(field.field_id)}
                        className={styles.recommendButton}
                      >
                        {fieldInfo.icon} {fieldInfo.name}
                      </Button>
                    );
                  })}
                </div>
              ) : (
                <p className={styles.emptyMessage}>You've started all fields!</p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Mastered Fields */}
      {masteredFields.length > 0 && (
        <section className={styles.section}>
          <h2>🌟 Mastered Fields</h2>
          <div className={styles.masteredGrid}>
            {masteredFields.map(progress => {
              const fieldInfo = getFieldInfo(progress.field_id);
              return (
                <div key={progress.field_id} className={styles.masteredCard}>
                  <div className={styles.masteredIcon}>{fieldInfo.icon}</div>
                  <h3>{fieldInfo.name}</h3>
                  <p className={styles.masteredLabel}>All 5 Levels Completed</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Explore More */}
      {notStartedFields.length > 0 && inProgressFields.length === 0 && (
        <section className={styles.section}>
          <h2>Start Exploring</h2>
          <p className={styles.sectionDescription}>
            Pick a field below to begin your journey:
          </p>
          <div className={styles.fieldsGrid}>
            {notStartedFields.map(progress => {
              const fieldInfo = getFieldInfo(progress.field_id);
              return (
                <div
                  key={progress.field_id}
                  className={styles.exploreCard}
                  onClick={() => handleStartField(progress.field_id)}
                >
                  <div className={styles.exploreIcon}>{fieldInfo.icon}</div>
                  <h3>{fieldInfo.name}</h3>
                  <p>Level 1</p>
                  <Button variant="primary" size="small">
                    Start
                  </Button>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
