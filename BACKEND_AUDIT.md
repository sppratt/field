# Backend Logic Audit - Critical Issues Found

## Issues Identified

### 1. **CRITICAL: Type Mismatch on Simulation Completion**
**Location:** `PathwayDetailClient.tsx` line 100-114

**Problem:**
```typescript
const nextStep = choice.nextStep !== null ? choice.nextStep : simulationState.currentStep + 1;
const isCompleted = nextStep === null || nextStep >= simulationState.totalSteps;
const completionPercentage = isCompleted ? 100 : Math.round(((nextStep + 1) / simulationState.totalSteps) * 100);

await updateProgress(user.id, career.id, nextStep, decisionsData, completionPercentage);
```

When a choice has `nextStep: null`, the code:
- Sets `nextStep = null` (correct)
- Sets `isCompleted = true` (correct)
- Passes `nextStep` (null) to `updateProgress`

But `updateProgress` expects `step: number`, and the DB schema defines `current_step: number` (not nullable).

**Fix:** When simulation is complete, pass the final step number instead of null:
```typescript
const stepToSave = isCompleted ? simulationState.totalSteps - 1 : nextStep;
await updateProgress(user.id, career.id, stepToSave, decisionsData, completionPercentage);
```

---

### 2. **MAJOR: Completion Percentage Calculation Error**
**Location:** `PathwayDetailClient.tsx` line 102

**Problem:**
```typescript
const completionPercentage = isCompleted ? 100 : Math.round(((nextStep + 1) / simulationState.totalSteps) * 100);
```

When `nextStep >= totalSteps`, the calculation becomes: `(totalSteps + 1) / totalSteps * 100` which exceeds 100%.

Also, if a choice branches to a later step (e.g., step 0 → step 2), it jumps completion percentage unpredictably.

**Example:** With 3 total steps (0, 1, 2):
- Step 0 → Step 1: `(1+1) / 3 * 100 = 66%` ✓
- Step 0 → Step 2: `(2+1) / 3 * 100 = 100%` (should be ~66%) ✗

**Fix:** Use step number relative to total steps:
```typescript
const completionPercentage = isCompleted ? 100 : Math.round(((nextStep + 1) / simulationState.totalSteps) * 100);
// Better: const completionPercentage = isCompleted ? 100 : Math.round(((nextStep / simulationState.totalSteps) * 100));
```

---

### 3. **MAJOR: State Update Race Condition**
**Location:** `PathwayDetailClient.tsx` line 105-120

**Problem:**
```typescript
setIsSaving(true);
try {
  await updateProgress(...);
  
  setSimulationState((prev) => ({
    ...prev,
    currentStep: nextStep,  // Could be null!
    choices: updatedChoices,
    tagScores: updatedTagScores,
    completed: isCompleted,
  }));
} finally {
  setIsSaving(false);
}
```

If `nextStep` is null, setting `currentStep: null` will break type safety and cause issues when rendering the next step.

**Fix:** Store the step value before setting state:
```typescript
const stepToStore = stepToSave; // Use the corrected step value
setSimulationState((prev) => ({
  ...prev,
  currentStep: stepToStore,
  // ...
}));
```

---

### 4. **MAJOR: Inconsistent Step Indexing**
**Location:** Multiple files

**Problem:**
- `SimulationStep.tsx`: Shows "Step {currentStep + 1} of {totalSteps}" (1-indexed for display) ✓
- `PathwayDetailClient.tsx`: Treats steps as 0-indexed internally ✓
- But completion check: `nextStep >= simulationState.totalSteps` assumes 0-indexed array length

For 3 steps [0, 1, 2], `totalSteps = 3`:
- `nextStep = 3` is OUT OF BOUNDS
- But comparison `3 >= 3` is true, so marks as complete
- This works by accident but is fragile

**Risk:** If logic changes, this could allow invalid state.

---

### 5. **MODERATE: Decisions Not Capturing Step Reference**
**Location:** `PathwayDetailClient.tsx` line 107-112

**Problem:**
```typescript
const decisionsData: Record<string, string | number | boolean> = {
  steps_taken: simulationState.currentStep + 1,
  current_step: nextStep,
  choices_json: JSON.stringify(updatedChoices),
  tagScores_json: JSON.stringify(updatedTagScores),
};
```

The `choices_json` stores choices by step index, but doesn't include:
- Timestamp when choice was made
- How long user spent on the step
- Whether they changed their mind

**Risk:** Can't audit user behavior or provide analytics.

---

### 6. **MODERATE: No Validation of Choice Existence**
**Location:** `PathwayDetailClient.tsx` line 296-300

**Problem:**
```typescript
onChoiceSelect={(choiceId) => {
  const selectedChoice = currentStepData.choices.find((c) => c.id === choiceId);
  if (selectedChoice) {
    handleChoiceSelect(selectedChoice);
  }
}}
```

No error logging if choice isn't found. Silent failures make debugging hard.

---

### 7. **MINOR: Tag Score Validation Missing**
**Location:** `PathwayDetailClient.tsx` line 93-98

**Problem:**
No validation that:
- Tag names match expected values
- Point values are within reasonable ranges
- Points don't overflow or underflow

**Risk:** Data corruption if simulation data is malformed.

---

## Summary of Fixes Needed (Priority Order)

| Priority | Issue | Impact | Fix Complexity |
|----------|-------|--------|-----------------|
| CRITICAL | Null step passed to DB | Type error, data loss | Low |
| CRITICAL | Completion % exceeds 100% | Incorrect progress display | Low |
| MAJOR | State race condition | UI/logic breaks | Low |
| MAJOR | Step indexing assumptions | Hidden bugs | Medium |
| MODERATE | Missing choice metadata | No analytics | Medium |
| MODERATE | No choice validation | Silent failures | Low |
| MINOR | Tag score validation | Data integrity | Medium |

---

## Recommended Action Plan

1. **Immediate (5 min):** Fix issues #1-3 (null handling, completion %, state safety)
2. **Short-term (15 min):** Add validation for choices and tag scores
3. **Medium-term (30 min):** Refactor step indexing for clarity
4. **Future:** Add decision metadata (timestamps, duration, changes)
