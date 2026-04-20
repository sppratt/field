import { createClient } from '@/utils/supabase/server';
import type { StudentFieldProgress, FieldStatus } from './types';

// Create client function for server-side usage
async function getClient() {
  return await createClient();
}

export async function getFieldProgress(
  userId: string,
  fieldId: string
): Promise<StudentFieldProgress | null> {
  const supabase = await getClient();

  const { data, error } = await supabase
    .from('student_field_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('field_id', fieldId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching field progress:', error);
  }

  return data || null;
}

export async function getAllFieldProgress(userId: string): Promise<StudentFieldProgress[]> {
  const supabase = await getClient();

  const { data, error } = await supabase
    .from('student_field_progress')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching all field progress:', error);
    return [];
  }

  return data || [];
}

export async function startField(userId: string, fieldId: string): Promise<StudentFieldProgress | null> {
  const supabase = await getClient();


  const { data, error } = await supabase
    .from('student_field_progress')
    .upsert({
      user_id: userId,
      field_id: fieldId,
      status: 'in_progress' as FieldStatus,
      current_level: 1,
      levels_completed: [],
      started_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error starting field:', error);
    return null;
  }

  return data;
}

export async function updateFieldLevel(
  userId: string,
  fieldId: string,
  newLevel: number,
  unlocked: boolean
): Promise<StudentFieldProgress | null> {
  const supabase = await getClient();

  let progress = await getFieldProgress(userId, fieldId);
  if (!progress) {
    // Defensive: create field progress if it doesn't exist
    progress = await startField(userId, fieldId);
    if (!progress) {
      console.error(`[updateFieldLevel] Failed to create field progress for user ${userId}, field ${fieldId}`);
      return null;
    }
  }

  const levelsCompleted = [...progress.levels_completed];
  if (unlocked && !levelsCompleted.includes(newLevel - 1)) {
    levelsCompleted.push(newLevel - 1);
  }

  const newStatus: FieldStatus =
    levelsCompleted.length === 5 ? 'mastered' : 'in_progress';


  const { data, error } = await supabase
    .from('student_field_progress')
    .update({
      current_level: newLevel,
      levels_completed: levelsCompleted,
      status: newStatus,
      completed_at: newStatus === 'mastered' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('field_id', fieldId)
    .select()
    .single();

  if (error) {
    console.error('Error updating field level:', error);
  }

  return data || null;
}

export async function getFieldsByStatus(
  userId: string,
  status: FieldStatus
): Promise<StudentFieldProgress[]> {
  const supabase = await getClient();

  const { data, error } = await supabase
    .from('student_field_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('status', status)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error(`Error fetching ${status} fields:`, error);
    return [];
  }

  return data || [];
}
