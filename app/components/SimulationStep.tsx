'use client';

import React, { useState } from 'react';
import styles from '@/app/styles/SimulationStep.module.css';

export interface Choice {
  id: string;
  title: string;
  description: string;
  icon: string;
  consequence: string;
  consequenceTone?: 'positive' | 'neutral' | 'bold';
}

export interface SimulationStepProps {
  scenario: string;
  question: string;
  choices: Choice[];
  currentStep: number;
  totalSteps: number;
  onChoiceSelect: (choiceId: string) => void;
}

export function SimulationStep({
  scenario,
  question,
  choices,
  currentStep,
  totalSteps,
  onChoiceSelect,
}: SimulationStepProps) {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleChoiceClick = (choiceId: string) => {
    setSelectedChoice(choiceId);
    setIsAnswered(true);

    setTimeout(() => {
      onChoiceSelect(choiceId);
      setSelectedChoice(null);
      setIsAnswered(false);
    }, 600);
  };

  return (
    <div className={styles.container}>
      {/* Progress Indicator - Artistic Line */}
      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
        <p className={styles.progressText}>
          Step {currentStep} of {totalSteps}
        </p>
      </div>

      {/* Scenario Stage - Theater Framing */}
      <div className={styles.scenarioContainer}>
        <div className={styles.scenarioBox}>
          <h2 className={styles.scenarioTitle}>{question}</h2>
          <p className={styles.scenarioText}>{scenario}</p>
          <div className={styles.scenarioAccent} />
        </div>
      </div>

      {/* Choice Cards - Asymmetric Theater Layout */}
      <div className={styles.choicesContainer}>
        {choices.map((choice, index) => (
          <button
            key={choice.id}
            className={`${styles.choiceCard} ${styles[`choiceCard-${index % 3}`]} ${
              selectedChoice === choice.id ? styles.chosen : ''
            } ${isAnswered && selectedChoice !== choice.id ? styles.unchosen : ''}`}
            onClick={() => handleChoiceClick(choice.id)}
            disabled={isAnswered}
          >
            {/* Icon Section */}
            <div className={styles.choiceIcon}>{choice.icon}</div>

            {/* Content Section */}
            <div className={styles.choiceContent}>
              <h3 className={styles.choiceTitle}>{choice.title}</h3>
              <p className={styles.choiceDescription}>{choice.description}</p>
            </div>


            {/* Selection Indicator */}
            {selectedChoice === choice.id && (
              <div className={styles.selectionCheckmark}>✓</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
