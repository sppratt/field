import type { StudentProgress } from '@/lib/db/types';

export type SkillTag = 'analytical' | 'creative' | 'hands_on' | 'social' | 'problem_solving';

export interface SkillScores {
  analytical: number;
  creative: number;
  hands_on: number;
  social: number;
  problem_solving: number;
}

export function getAggregateTagScores(progress: StudentProgress[]): SkillScores {
  const tagScores: SkillScores = {
    analytical: 0,
    creative: 0,
    hands_on: 0,
    social: 0,
    problem_solving: 0,
  };

  progress.forEach(p => {
    if (p.status === 'completed' || p.status === 'in_progress') {
      try {
        const tagScoresJson = p.decisions_made?.tagScores_json;
        if (tagScoresJson) {
          const scores =
            typeof tagScoresJson === 'string'
              ? JSON.parse(tagScoresJson)
              : tagScoresJson;
          Object.keys(scores).forEach(tag => {
            if (tag in tagScores) {
              tagScores[tag as SkillTag] += scores[tag] || 0;
            }
          });
        }
      } catch (err) {
        console.error('Error parsing tag scores:', err);
      }
    }
  });

  return tagScores;
}

export function getTopSkill(scores: SkillScores): SkillTag | null {
  const entries = Object.entries(scores);
  if (entries.length === 0) return null;

  const [topSkill] = entries.reduce((a, b) => (a[1] > b[1] ? a : b));
  return topSkill as SkillTag;
}

export function getSkillPercentage(scores: SkillScores): Record<SkillTag, number> {
  const total = Object.values(scores).reduce((sum, val) => sum + val, 0);
  if (total === 0) {
    return {
      analytical: 0,
      creative: 0,
      hands_on: 0,
      social: 0,
      problem_solving: 0,
    };
  }

  const percentages: Record<string, number> = {};
  Object.entries(scores).forEach(([key, value]) => {
    percentages[key] = Math.round((value / total) * 100);
  });

  return percentages as Record<SkillTag, number>;
}

export function getAllSkillsAboveThreshold(scores: SkillScores, threshold: number): boolean {
  return Object.values(scores).every(score => score > threshold);
}

export function getSkillsDiscovered(scores: SkillScores): number {
  return Object.values(scores).filter(score => score > 0).length;
}

export function getSkillLabel(skill: SkillTag): string {
  const labels: Record<SkillTag, string> = {
    analytical: 'Analytical',
    creative: 'Creative',
    hands_on: 'Hands-on',
    social: 'Social',
    problem_solving: 'Problem-solving',
  };
  return labels[skill];
}

export function getSkillEmoji(skill: SkillTag): string {
  const emojis: Record<SkillTag, string> = {
    analytical: '🧠',
    creative: '🎨',
    hands_on: '🔧',
    social: '🤝',
    problem_solving: '🔍',
  };
  return emojis[skill];
}
