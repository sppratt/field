import { createClient } from '@/utils/supabase/client';
import type { StudentLevelAttempt } from './types';

const supabase = createClient();

export async function recordAttempt(
  userId: string,
  fieldId: string,
  level: number,
  score: number,
  decisions: Record<string, any>,
  unlockedNext: boolean
): Promise<StudentLevelAttempt | null> {
  // First, get the next attempt number
  const { data: existingAttempts, error: countError } = await supabase
    .from('student_level_attempts')
    .select('attempt_number')
    .eq('user_id', userId)
    .eq('field_id', fieldId)
    .eq('level', level)
    .order('attempt_number', { ascending: false })
    .limit(1);

  if (countError) {
    console.error('Error getting attempt count:', countError);
  }

  const nextAttemptNumber = (existingAttempts?.[0]?.attempt_number || 0) + 1;

  const { data, error } = await supabase
    .from('student_level_attempts')
    .insert({
      user_id: userId,
      field_id: fieldId,
      level,
      attempt_number: nextAttemptNumber,
      score,
      decisions_made: decisions,
      unlocked_next_level: unlockedNext,
      completed_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error recording attempt:', error);
  }

  return data || null;
}

export async function getAttemptsForLevel(
  userId: string,
  fieldId: string,
  level: number
): Promise<StudentLevelAttempt[]> {
  const { data, error } = await supabase
    .from('student_level_attempts')
    .select('*')
    .eq('user_id', userId)
    .eq('field_id', fieldId)
    .eq('level', level)
    .order('attempt_number', { ascending: true });

  if (error) {
    console.error('Error fetching attempts:', error);
    return [];
  }

  return data || [];
}

export async function getBestAttempt(
  userId: string,
  fieldId: string,
  level: number
): Promise<StudentLevelAttempt | null> {
  const { data, error } = await supabase
    .from('student_level_attempts')
    .select('*')
    .eq('user_id', userId)
    .eq('field_id', fieldId)
    .eq('level', level)
    .order('score', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching best attempt:', error);
  }

  return data || null;
}

export async function getFieldAttempts(
  userId: string,
  fieldId: string
): Promise<StudentLevelAttempt[]> {
  const { data, error } = await supabase
    .from('student_level_attempts')
    .select('*')
    .eq('user_id', userId)
    .eq('field_id', fieldId)
    .order('completed_at', { ascending: false });

  if (error) {
    console.error('Error fetching field attempts:', error);
    return [];
  }

  return data || [];
}

export async function calculateFieldVelocity(
  userId: string,
  fieldId: string
): Promise<{ [key: string]: number | null }> {
  const attempts = await getFieldAttempts(userId, fieldId);
  const unlockedLevels = attempts
    .filter(a => a.unlocked_next_level)
    .sort((a, b) => a.level - b.level);

  const velocity: { [key: string]: number | null } = {
    'level_1_to_2_days': null,
    'level_2_to_3_days': null,
    'level_3_to_4_days': null,
    'level_4_to_5_days': null,
  };

  for (let i = 0; i < unlockedLevels.length - 1; i++) {
    const current = new Date(unlockedLevels[i].completed_at);
    const next = new Date(unlockedLevels[i + 1].completed_at);
    const daysDiff = (next.getTime() - current.getTime()) / (1000 * 60 * 60 * 24);
    velocity[`level_${unlockedLevels[i].level}_to_${unlockedLevels[i + 1].level}_days`] =
      Math.round(daysDiff * 100) / 100;
  }

  return velocity;
}

export async function getDecisionPatterns(
  userId: string,
  fieldId: string
): Promise<Record<string, number>> {
  const attempts = await getFieldAttempts(userId, fieldId);

  // Aggregate tag effects from all attempts
  const patterns: Record<string, number> = {
    analytical: 0,
    creative: 0,
    hands_on: 0,
    social: 0,
    problem_solving: 0,
  };

  attempts.forEach(attempt => {
    const decisions = attempt.decisions_made as Record<string, any>;
    if (decisions?.tagEffects) {
      Object.entries(decisions.tagEffects).forEach(([tag, points]) => {
        if (tag in patterns) {
          patterns[tag] += (points as number) || 0;
        }
      });
    }
  });

  // Convert to percentages
  const total = Object.values(patterns).reduce((a, b) => a + b, 0);
  if (total > 0) {
    Object.keys(patterns).forEach(tag => {
      patterns[tag] = Math.round((patterns[tag] / total) * 100);
    });
  }

  return patterns;
}
