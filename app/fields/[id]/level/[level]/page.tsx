'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { QuizTemplate } from '@/lib/db/types';
import QuizLevelFlow from '@/app/components/QuizLevelFlow';
import { Button } from '@/app/components/Button';
import styles from '@/app/styles/QuizPage.module.css';

const FIELD_NAMES: Record<string, string> = {
  'software-engineer': 'Software Engineer',
  'nurse': 'Nurse',
  'graphic-designer': 'Graphic Designer',
  'data-analyst': 'Data Analyst',
  'architect': 'Architect',
};

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const fieldId = params.id as string;
  const levelNum = parseInt(params.level as string, 10);

  const [template, setTemplate] = useState<QuizTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/quiz/templates?field_id=${fieldId}&level=${levelNum}`,
          {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          if (response.status === 403) {
            throw new Error('Level locked. Complete the previous level first.');
          }
          if (response.status === 401) {
            throw new Error('Please log in to continue.');
          }
          throw new Error('Failed to load quiz');
        }

        const data = await response.json();
        setTemplate(data.template);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [fieldId, levelNum]);


  const fieldName = FIELD_NAMES[fieldId] || fieldId;

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <p>Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <h2>Unable to Load Quiz</h2>
          <p>{error}</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <h2>Quiz Not Found</h2>
          <Button onClick={() => router.push(`/pathways/${fieldId}`)}>
            Back to {fieldName}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button
          variant="secondary"
          onClick={() => router.push(`/pathways/${fieldId}`)}
        >
          ← Back to {fieldName}
        </Button>
      </div>

      <QuizLevelFlow
        template={template}
        fieldId={fieldId}
        level={levelNum}
        onRetry={() => window.location.reload()}
      />
    </div>
  );
}
