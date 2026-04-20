import type { Career } from '@/app/data/careers';
import type { SkillScores } from './skillScoring';

export interface CareerMatch {
  career: Career;
  matchScore: number;
  matchPercentage: number;
  reasoning: string;
}

export function calculateCareerMatch(career: Career, skillScores: SkillScores): CareerMatch {
  const matchScore = career.recommendationTags.reduce((sum, tag) => {
    return sum + (skillScores[tag as keyof SkillScores] || 0);
  }, 0);

  const maxPossibleScore = career.recommendationTags.length * 10;
  const matchPercentage = maxPossibleScore > 0 ? Math.round((matchScore / maxPossibleScore) * 100) : 0;

  // Generate reasoning based on top matching skills
  const topMatches = career.recommendationTags
    .sort((a, b) => (skillScores[b as keyof SkillScores] || 0) - (skillScores[a as keyof SkillScores] || 0))
    .slice(0, 2)
    .map(tag => tag.replace(/_/g, ' '))
    .join(' and ');

  const reasoning = topMatches
    ? `You scored high in ${topMatches}—skills that are essential for this career.`
    : 'Continue exploring to see how you match with this career.';

  return {
    career,
    matchScore,
    matchPercentage,
    reasoning,
  };
}

export function rankCareersForStudent(careers: Career[], skillScores: SkillScores): CareerMatch[] {
  return careers
    .map(career => calculateCareerMatch(career, skillScores))
    .sort((a, b) => b.matchPercentage - a.matchPercentage);
}

export function getTopMatchedCareers(careers: Career[], skillScores: SkillScores, count: number = 2): CareerMatch[] {
  return rankCareersForStudent(careers, skillScores).slice(0, count);
}

export function getCareerRecommendationsBySkills(
  careers: Career[],
  skillScores: SkillScores,
  skillName: string,
  limit: number = 3
): Career[] {
  return careers
    .filter(career => career.recommendationTags.includes(skillName as any))
    .sort((a, b) => {
      const aScore = a.recommendationTags.length;
      const bScore = b.recommendationTags.length;
      return bScore - aScore;
    })
    .slice(0, limit);
}
