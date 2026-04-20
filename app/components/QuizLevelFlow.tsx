'use client';

import { useState, useEffect } from 'react';
import type { QuizTemplate, QuizStep, QuizChoice } from '@/lib/db/types';
import styles from '@/app/styles/QuizLevelFlow.module.css';
import { Button } from './Button';
import LevelUnlockModal from './modals/LevelUnlockModal';

interface QuizLevelFlowProps {
  template: QuizTemplate;
  fieldId: string;
  level: number;
  onComplete?: (score: number, unlockedNext: boolean) => void;
  onRetry?: () => void;
}

export default function QuizLevelFlow({
  template,
  fieldId,
  level,
  onComplete,
  onRetry,
}: QuizLevelFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [choices, setChoices] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [showUnlock, setShowUnlock] = useState(false);
  const [score, setScore] = useState(0);
  const [unlockedNext, setUnlockedNext] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps = template.quiz_data.steps;
  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const hasChosenCurrent = choices[currentStep] !== undefined;

  const handleChoiceSelect = (choiceId: string) => {
    setChoices(prev => ({
      ...prev,
      [currentStep]: choiceId,
    }));
  };

  const handleChoiceKeyDown = (e: React.KeyboardEvent, choiceId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleChoiceSelect(choiceId);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const buttons = Array.from(
        document.querySelectorAll(`.${styles.choiceButton}`)
      ) as HTMLButtonElement[];
      const currentIndex = buttons.findIndex(btn => btn.getAttribute('aria-selected') === 'true');
      const nextIndex = (currentIndex + 1) % buttons.length;
      buttons[nextIndex]?.focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const buttons = Array.from(
        document.querySelectorAll(`.${styles.choiceButton}`)
      ) as HTMLButtonElement[];
      const currentIndex = buttons.findIndex(btn => btn.getAttribute('aria-selected') === 'true');
      const prevIndex = currentIndex === 0 ? buttons.length - 1 : currentIndex - 1;
      buttons[prevIndex]?.focus();
    }
  };

  const handleNext = () => {
    if (!hasChosenCurrent) return;

    if (isLastStep) {
      handleSubmitQuiz();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSubmitQuiz = async () => {
    setLoading(true);
    setError(null);

    try {
      // Prepare selected choices with their effects
      const selectedChoices = steps.map((s, idx) => {
        const choiceId = choices[idx];
        const choice = s.choices.find(c => c.id === choiceId);
        return {
          step: idx,
          choiceId,
          tagEffects: choice?.tagEffects || {},
        };
      });

      const response = await fetch('/api/quiz/attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fieldId,
          level,
          choices: selectedChoices,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit quiz');
      }

      const data = await response.json();

      setScore(Math.round(data.score));
      setUnlockedNext(data.unlockedNext);
      setShowUnlock(true);

      onComplete?.(data.score, data.unlockedNext);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setChoices({});
    setCurrentStep(0);
    setError(null);
    onRetry?.();
  };

  if (showUnlock) {
    return (
      <LevelUnlockModal
        level={level}
        score={score}
        unlockedNext={unlockedNext}
        onContinue={() => setShowUnlock(false)}
      />
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>{template.title}</h2>
        <div className={styles.progress}>
          <span id="step-counter">
            Step {currentStep + 1} of {steps.length}
          </span>
          <div
            className={styles.progressBar}
            role="progressbar"
            aria-valuenow={currentStep + 1}
            aria-valuemin={1}
            aria-valuemax={steps.length}
            aria-labelledby="step-counter"
          >
            <div
              className={styles.progressFill}
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.content}>
        <div className={styles.scenario}>
          <p className={styles.scenarioText}>{step.scenario}</p>
        </div>

        <div className={styles.question}>
          <h3>{step.question}</h3>
        </div>

        <div
          className={styles.choices}
          role="group"
          aria-label="Answer choices"
        >
          {step.choices.map((choice: QuizChoice) => (
            <button
              key={choice.id}
              className={`${styles.choiceButton} ${
                choices[currentStep] === choice.id ? styles.selected : ''
              }`}
              onClick={() => handleChoiceSelect(choice.id)}
              onKeyDown={(e) => handleChoiceKeyDown(e, choice.id)}
              disabled={loading}
              aria-selected={choices[currentStep] === choice.id}
              role="option"
              aria-label={`${choice.text}: ${choice.feedback}`}
            >
              <div className={styles.choiceText}>{choice.text}</div>
              <div className={styles.choiceFeedback}>{choice.feedback}</div>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.footer}>
        <Button
          variant="secondary"
          onClick={handleRetry}
          disabled={loading}
        >
          Restart
        </Button>
        <Button
          onClick={handleNext}
          disabled={!hasChosenCurrent || loading}
          loading={loading}
        >
          {isLastStep ? 'Submit Quiz' : 'Next Step'}
        </Button>
      </div>
    </div>
  );
}
