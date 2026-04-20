import type { StudentLevelAttempt, RecommendationTag } from '@/lib/db/types';

export interface SkillMetric {
  tag: RecommendationTag;
  score: number;
  velocity: number; // change over time
  trend: 'increasing' | 'stable' | 'decreasing';
}

export function calculateAggregateTagScores(
  attempts: StudentLevelAttempt[]
): Record<RecommendationTag, number> {
  const scores: Record<RecommendationTag, number> = {
    analytical: 0,
    creative: 0,
    hands_on: 0,
    social: 0,
    problem_solving: 0,
  };

  attempts.forEach(attempt => {
    const decisions = attempt.decisions_made as Record<string, any>;
    if (decisions?.tagScores) {
      Object.entries(decisions.tagScores).forEach(([tag, points]) => {
        if (tag in scores) {
          scores[tag as RecommendationTag] += (points as number) || 0;
        }
      });
    }
  });

  return scores;
}

export function calculateSkillVelocity(
  recentAttempts: StudentLevelAttempt[],
  olderAttempts: StudentLevelAttempt[]
): Record<RecommendationTag, number> {
  const recentScores = calculateAggregateTagScores(recentAttempts);
  const olderScores = calculateAggregateTagScores(olderAttempts);

  const velocity: Record<RecommendationTag, number> = {
    analytical: recentScores.analytical - olderScores.analytical,
    creative: recentScores.creative - olderScores.creative,
    hands_on: recentScores.hands_on - olderScores.hands_on,
    social: recentScores.social - olderScores.social,
    problem_solving: recentScores.problem_solving - olderScores.problem_solving,
  };

  return velocity;
}

export function getEmergingStrengths(
  recentAttempts: StudentLevelAttempt[],
  olderAttempts: StudentLevelAttempt[],
  threshold = 5
): SkillMetric[] {
  const velocity = calculateSkillVelocity(recentAttempts, olderAttempts);
  const recentScores = calculateAggregateTagScores(recentAttempts);

  return (Object.entries(velocity) as [RecommendationTag, number][])
    .map(([tag, vel]) => ({
      tag,
      score: recentScores[tag],
      velocity: vel,
      trend: vel > threshold ? 'increasing' : vel < -threshold ? 'decreasing' : 'stable',
    }))
    .filter(m => m.trend !== 'stable')
    .sort((a, b) => Math.abs(b.velocity) - Math.abs(a.velocity)) as any as SkillMetric[];
}

export function calculateFieldAffinity(
  fieldAttempts: Record<string, StudentLevelAttempt[]>
): Record<string, { depth: number; engagement: number; strength: number }> {
  const affinity: Record<string, { depth: number; engagement: number; strength: number }> = {};

  Object.entries(fieldAttempts).forEach(([fieldId, attempts]) => {
    // Depth = how many levels completed
    const unlockedLevels = attempts.filter(a => a.unlocked_next_level);
    const depth = Math.max(...attempts.map(a => a.level), 0);

    // Engagement = total time spent (approximated by number of attempts)
    const engagement = attempts.length;

    // Strength = average score across attempts
    const avgScore = attempts.length > 0
      ? attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length
      : 0;

    affinity[fieldId] = {
      depth,
      engagement,
      strength: Math.round(avgScore),
    };
  });

  return affinity;
}

export function getRecommendedNextFields(
  topSkills: RecommendationTag[],
  fieldsStarted: string[]
): string[] {
  // Map skills to fields that emphasize them
  const skillToFields: Record<RecommendationTag, string[]> = {
    analytical: ['data-analyst', 'software-engineer'],
    creative: ['graphic-designer', 'architect'],
    hands_on: ['architect', 'graphic-designer'],
    social: ['nurse', 'graphic-designer'],
    problem_solving: ['software-engineer', 'data-analyst', 'architect'],
  };

  // Find fields that complement top skills
  const recommendedFields = new Set<string>();

  topSkills.forEach(skill => {
    const relatedFields = skillToFields[skill] || [];
    relatedFields.forEach(field => {
      if (!fieldsStarted.includes(field)) {
        recommendedFields.add(field);
      }
    });
  });

  return Array.from(recommendedFields).slice(0, 3);
}
