import { createClient } from '@/utils/supabase/client';
import type { StudentChallenge } from './types';

const supabase = createClient();

function getStartOfWeek(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const weekStart = new Date(d.setDate(diff));
  return weekStart.toISOString().split('T')[0];
}

export async function getCurrentWeekChallenges(userId: string): Promise<StudentChallenge[]> {
  try {
    const weekOf = getStartOfWeek(new Date());

    const { data, error } = await supabase
      .from('student_challenges')
      .select('*')
      .eq('user_id', userId)
      .eq('week_of', weekOf);

    if (error) {
      console.error('Error fetching challenges:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Error in getCurrentWeekChallenges:', err);
    return [];
  }
}

export async function completeChallenge(
  userId: string,
  challengeType: string,
  weekOf: string
): Promise<StudentChallenge | null> {
  try {
    const { data, error } = await supabase
      .from('student_challenges')
      .update({
        completed: true,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('challenge_type', challengeType)
      .eq('week_of', weekOf)
      .select()
      .single();

    if (error) {
      console.error('Error completing challenge:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Error in completeChallenge:', err);
    return null;
  }
}

export async function generateWeekChallenges(userId: string): Promise<StudentChallenge[]> {
  try {
    const weekOf = getStartOfWeek(new Date());
    const existingChallenges = await getCurrentWeekChallenges(userId);

    if (existingChallenges.length > 0) {
      // Challenges already exist for this week
      return existingChallenges;
    }

    // Generate 2 random challenges for the week
    const challengeTypes = ['weekly_new', 'compare_careers', 'skill_balance'];
    const selected = challengeTypes.slice(0, 2); // Pick first 2

    const { data, error } = await supabase
      .from('student_challenges')
      .insert(
        selected.map(type => ({
          user_id: userId,
          challenge_type: type,
          week_of: weekOf,
          completed: false,
        }))
      )
      .select();

    if (error) {
      console.error('Error generating challenges:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Error in generateWeekChallenges:', err);
    return [];
  }
}
