'use client';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import styles from './StatsModals.module.css';
import type { StudentProgress } from '@/lib/db/types';
import type { Career } from '@/app/data/careers';
import { simulations } from '@/app/data/simulations';

interface DecisionReplayModalProps {
  open: boolean;
  onClose: () => void;
  progress: StudentProgress | null;
  career: Career | null;
}

export const DecisionReplayModal = ({
  open,
  onClose,
  progress,
  career,
}: DecisionReplayModalProps) => {
  if (!progress || !career) {
    return null;
  }

  const simulation = simulations[career.id];
  if (!simulation) {
    return null;
  }

  let choices: Record<number, { choiceId: string; tagEffects?: Record<string, number> }> = {};
  try {
    const choicesJson = progress.decisions_made?.choices_json;
    if (choicesJson) {
      choices =
        typeof choicesJson === 'string' ? JSON.parse(choicesJson) : choicesJson;
    }
  } catch (err) {
    console.error('Error parsing choices:', err);
  }

  const getChoiceText = (stepNum: number): string | null => {
    const choice = choices[stepNum];
    if (!choice) return null;

    const step = simulation.steps.find(s => s.stepNumber === stepNum + 1);
    if (!step) return null;

    const selectedChoice = step.choices.find(c => c.id === choice.choiceId);
    return selectedChoice?.text || null;
  };

  const stepsCompleted = Object.keys(choices).length;

  return (
    <Dialog open={open} onClose={onClose} className={styles.dialog} maxWidth="sm" fullWidth>
      <DialogTitle className={styles.dialogTitle}>
        <span className={styles.titleText}>Your Journey</span>
        <span className={styles.titleSubtext}>{career.title} Simulation</span>
      </DialogTitle>
      <DialogContent className={styles.dialogContent}>
        <div className={styles.decisionReplayContainer}>
          <div className={styles.progressSummary}>
            <p>
              You completed <strong>{stepsCompleted} of {simulation.steps.length}</strong> steps
            </p>
          </div>

          <div className={styles.decisionsTimeline}>
            {simulation.steps.map((step, idx) => {
              const choiceText = getChoiceText(idx);
              const isCompleted = choiceText !== null;

              return (
                <div key={step.id} className={`${styles.decisionStep} ${isCompleted ? styles.completed : ''}`}>
                  <div className={styles.stepNumber}>
                    {isCompleted ? '✓' : idx + 1}
                  </div>
                  <div className={styles.stepContent}>
                    <p className={styles.stepScenario}>{step.scenario}</p>
                    {isCompleted && (
                      <p className={styles.chosenPath}>
                        <strong>You chose:</strong> {choiceText}
                      </p>
                    )}
                    {!isCompleted && (
                      <p className={styles.unfinished}>Simulation incomplete at this step</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.reflectionBox}>
            <p>
              💡 Each choice shaped your experience in this career. The decisions you made reveal
              what matters to you in a professional setting.
            </p>
          </div>
        </div>
      </DialogContent>
      <DialogActions className={styles.dialogActions}>
        <Button onClick={onClose} variant="outlined" className={styles.button}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
