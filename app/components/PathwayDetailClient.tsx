'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers/AuthProvider';
import { Button } from '@/app/components/Button';
import { SimulationStep } from '@/app/components/SimulationStep';
import { SimulationIntro } from '@/app/components/SimulationIntro';
import type { Choice } from '@/app/components/SimulationStep';
import { Career, RecommendationTag } from '@/app/data/careers';
import { Simulation, SimulationChoice, TagEffects } from '@/app/data/simulations';
import { simulations } from '@/app/data/simulations';
import { updateProgress } from '@/lib/db/progress';
import styles from '@/app/styles/PathwayDetail.module.css';

interface PathwayDetailClientProps {
  career: Career;
}

interface SimulationState {
  started: boolean;
  introShown: boolean;
  currentStep: number;
  totalSteps: number;
  choices: Record<number, { choiceId: string; tagEffects?: TagEffects }>;
  tagScores: Record<RecommendationTag, number>;
  completed: boolean;
}

export function PathwayDetailClient({ career }: PathwayDetailClientProps) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [simulationState, setSimulationState] = useState<SimulationState>({
    started: false,
    introShown: false,
    currentStep: 0,
    totalSteps: 0,
    choices: {},
    tagScores: {
      analytical: 0,
      creative: 0,
      hands_on: 0,
      social: 0,
      problem_solving: 0,
    },
    completed: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const simulation: Simulation | undefined = simulations[career.id];

  const handleStartSimulation = () => {
    if (!user) {
      router.push(`/auth/login?redirect=${encodeURIComponent(`/pathways/${career.id}`)}`);
      return;
    }

    if (!simulation) {
      setError('Simulation not found for this career.');
      return;
    }

    setSimulationState((prev) => ({
      ...prev,
      started: true,
      introShown: false,
      currentStep: 0,
      totalSteps: simulation.steps.length,
    }));
    setError(null);
  };

  const handleBeginScenario = () => {
    setSimulationState((prev) => ({
      ...prev,
      introShown: true,
    }));
  };

  const handleChoiceSelect = async (choice: SimulationChoice) => {
    if (!user) return;

    const updatedChoices = {
      ...simulationState.choices,
      [simulationState.currentStep]: {
        choiceId: choice.id,
        tagEffects: choice.tagEffects || {},
      },
    };

    // Validate tag effects
    if (choice.tagEffects) {
      const validTags = ['analytical', 'creative', 'hands_on', 'social', 'problem_solving'];
      for (const tag of Object.keys(choice.tagEffects)) {
        if (!validTags.includes(tag)) {
          console.warn(`Invalid tag in simulation data: ${tag}`);
        }
      }
    }

    // Calculate new tag scores
    const updatedTagScores = { ...simulationState.tagScores };
    if (choice.tagEffects) {
      Object.entries(choice.tagEffects).forEach(([tag, points]) => {
        if (tag in updatedTagScores) {
          updatedTagScores[tag as RecommendationTag] += points;
        }
      });
    }

    // Determine next step
    let nextStep: number;
    if (choice.nextStep !== null && typeof choice.nextStep === 'number') {
      nextStep = choice.nextStep;
    } else {
      nextStep = simulationState.currentStep + 1;
    }

    // Check if simulation is complete
    const isCompleted = nextStep >= simulationState.totalSteps;

    // Calculate completion percentage correctly
    let completionPercentage: number;
    if (isCompleted) {
      completionPercentage = 100;
    } else {
      // Progress is based on steps visited, not next step
      completionPercentage = Math.round(((nextStep + 1) / simulationState.totalSteps) * 100);
      // Cap at 99% until actually complete
      completionPercentage = Math.min(completionPercentage, 99);
    }

    // Save progress to database
    setIsSaving(true);
    try {
      const decisionsData: Record<string, string | number | boolean> = {
        steps_taken: simulationState.currentStep + 1,
        current_step: nextStep,
        choices_json: JSON.stringify(updatedChoices),
        tagScores_json: JSON.stringify(updatedTagScores),
        completed: isCompleted,
      };

      // Always pass valid step number to DB (use final step if complete)
      const stepToSave = isCompleted ? simulationState.totalSteps - 1 : nextStep;
      await updateProgress(user.id, career.id, stepToSave, decisionsData, completionPercentage);

      setSimulationState((prev) => ({
        ...prev,
        currentStep: nextStep,
        choices: updatedChoices,
        tagScores: updatedTagScores,
        completed: isCompleted,
      }));
    } catch (err) {
      setError('Failed to save progress. Please try again.');
      console.error('Error saving progress:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRestartSimulation = async () => {
    if (!user) return;

    // Reset local state
    setSimulationState({
      started: false,
      introShown: false,
      currentStep: 0,
      totalSteps: 0,
      choices: {},
      tagScores: {
        analytical: 0,
        creative: 0,
        hands_on: 0,
        social: 0,
        problem_solving: 0,
      },
      completed: false,
    });
    setError(null);

    // Reset progress in database
    try {
      await updateProgress(user.id, career.id, 0, {}, 0);
    } catch (err) {
      console.error('Error resetting progress:', err);
      // Still allow local restart even if DB update fails
    }
  };

  const currentStepData = simulation && simulationState.currentStep < simulation.steps.length ? simulation.steps[simulationState.currentStep] : null;

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>{career.title}</h1>
          <p className={styles.description}>{career.description}</p>
        </div>
      </section>

      <div className={styles.container}>
        {!simulationState.started ? (
          <>
            {/* Career Overview Section */}
            <section style={{ marginBottom: 'var(--spacing-2xl)' }}>
              <h2 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--spacing-lg)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text)' }}>
                About This Field
              </h2>
              <p style={{ fontSize: 'var(--font-size-lg)', lineHeight: 'var(--line-height-relaxed)', color: 'var(--color-text-light)', marginBottom: 'var(--spacing-lg)' }}>
                {career.overview}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-2xl)' }}>
                <div className={styles.infoCard}>
                  <h3>Key Skills</h3>
                  <div className={styles.skillsList}>
                    {career.keySkills.map((skill) => (
                      <div key={skill} className={styles.skillItem}>
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <h3>Typical Tasks</h3>
                  <div className={styles.skillsList}>
                    {career.typicalTasks.map((task) => (
                      <div key={task} className={styles.skillItem}>
                        {task}
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <h3>Salary Outlook</h3>
                  <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text)', lineHeight: 'var(--line-height-normal)' }}>
                    <strong>Entry:</strong> {career.salaryOutlook.entryLevel}
                    <br />
                    <strong>Experienced:</strong> {career.salaryOutlook.experienced}
                    <br />
                    <strong>Outlook:</strong> {career.salaryOutlook.outlook}
                  </p>
                </div>
              </div>

              <div className={styles.infoCard}>
                <h3>Education Path</h3>
                <p>{career.educationPath}</p>
              </div>
            </section>

            {/* Simulation CTA Section */}
            <section className={styles.simulationSection}>
              <div className={styles.simulationContainer}>
                <h2>Ready to explore this field?</h2>
                <p className={styles.simulationPlaceholder}>
                  Step into a realistic scenario and make decisions like a {career.title.toLowerCase()} would. See how your choices shape the outcome.
                </p>
                <Button
                  onClick={handleStartSimulation}
                  variant="primary"
                  size="large"
                  disabled={loading || !simulation}
                >
                  {loading ? 'Loading...' : 'Start Simulation'}
                </Button>
                {!user && (
                  <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                    Log in to start the simulation
                  </p>
                )}
                {error && !simulationState.started && (
                  <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--color-error, #dc2626)' }}>
                    {error}
                  </p>
                )}
              </div>

              <div className={styles.infoSection}>
                <div className={styles.infoCard}>
                  <h3>Estimated Time</h3>
                  <p>{simulation?.estimatedTime || '8-12'} minutes</p>
                </div>

                <div className={styles.infoCard}>
                  <h3>What You&apos;ll Experience</h3>
                  <p>
                    Real-world scenarios, meaningful decisions, and outcomes that reflect professional challenges in this field.
                  </p>
                </div>

                <div className={styles.infoCard}>
                  <h3>Recommendation Tags</h3>
                  <div className={styles.skillsList}>
                    {career.recommendationTags.map((tag) => (
                      <div key={tag} className={styles.skillItem}>
                        {tag.replace(/_/g, ' ')}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          <>
            {/* Simulation UI */}
            <section style={{ marginBottom: 'var(--spacing-2xl)' }}>
              {!simulationState.introShown && simulation ? (
                <SimulationIntro
                  title={simulation.title}
                  introduction={simulation.intro}
                  onBegin={handleBeginScenario}
                />
              ) : (
                <>
                  <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                      <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text)', margin: 0 }}>
                        {simulation?.title}
                      </h2>
                      <span style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-light)' }}>
                        Step {simulationState.currentStep + 1} of {simulationState.totalSteps}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          backgroundColor: 'var(--color-primary)',
                          width: `${(simulationState.currentStep / simulationState.totalSteps) * 100}%`,
                          transition: 'width 0.3s ease-in-out',
                        }}
                      />
                    </div>
                  </div>

                  {!simulationState.completed && currentStepData ? (
                <SimulationStep
                  scenario={currentStepData.scenario}
                  question={currentStepData.question}
                  choices={currentStepData.choices.map((choice) => ({
                    id: choice.id,
                    title: choice.text,
                    description: choice.description || '',
                    icon: choice.icon || '→',
                    consequence: choice.consequence || 'See where this choice leads',
                    consequenceTone: choice.consequenceTone as 'positive' | 'neutral' | 'bold' | undefined,
                  }))}
                  currentStep={simulationState.currentStep + 1}
                  totalSteps={simulationState.totalSteps}
                  onChoiceSelect={(choiceId) => {
                    const selectedChoice = currentStepData.choices.find((c) => c.id === choiceId);
                    if (selectedChoice) {
                      handleChoiceSelect(selectedChoice);
                    } else {
                      setError(`Invalid choice selected. Please try again.`);
                      console.error(`Choice ${choiceId} not found in step ${simulationState.currentStep}`);
                    }
                  }}
                />
                  ) : simulationState.completed && simulation ? (
                    <div className={styles.simulationContainer}>
                      <h3 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text)', marginBottom: 'var(--spacing-lg)', fontWeight: 'var(--font-weight-semibold)' }}>
                        Simulation Complete!
                      </h3>

                      <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text-light)', marginBottom: 'var(--spacing-lg)', lineHeight: 'var(--line-height-relaxed)' }}>
                        {simulation.outcomeSummary}
                      </p>

                      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                        <h4 style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: 'var(--spacing-md)', fontWeight: 'var(--font-weight-semibold)' }}>
                          Your Tag Scores
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-md)' }}>
                          {Object.entries(simulationState.tagScores).map(([tag, score]) => (
                            <div key={tag} style={{ fontSize: 'var(--font-size-base)', color: 'var(--color-text)' }}>
                              <strong>{tag.replace(/_/g, ' ')}:</strong> {score} pts
                            </div>
                          ))}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                        <Button onClick={handleRestartSimulation} variant="secondary">
                          Restart Simulation
                        </Button>
                        <Button href={`/pathways/${career.id}`} variant="primary">
                          Back to {career.title}
                        </Button>
                      </div>
                    </div>
                  ) : null}

                  {error && (
                    <p style={{ marginTop: 'var(--spacing-lg)', fontSize: '0.9rem', color: 'var(--color-error, #dc2626)' }}>
                      {error}
                    </p>
                  )}
                </>
              )}
            </section>
          </>
        )}

        <div className={styles.backButton}>
          <Button href="/pathways" variant="secondary">
            ← Back to Fields
          </Button>
        </div>
      </div>
    </div>
  );
}
