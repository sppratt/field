import { createClient } from '@/utils/supabase/client';
import type { StudentProgress, ProgressStatus } from './types';

const supabase = createClient();

// Get progress for a specific pathway
export async function getPathwayProgress(
  userId: string,
  pathwayId: string
): Promise<StudentProgress | null> {
  const { data, error } = await supabase
    .from('student_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('pathway_id', pathwayId)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 is "no rows returned" which is expected
    console.error('Error fetching progress:', error);
  }

  return data || null;
}

// Get all progress for a user (overview)
export async function getUserProgress(userId: string): Promise<StudentProgress[]> {
  const { data, error } = await supabase
    .from('student_progress')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching user progress:', error);
    return [];
  }

  return data || [];
}

// Create or update progress
export async function upsertProgress(
  userId: string,
  pathwayId: string,
  updates: Partial<StudentProgress>
): Promise<{ progress: StudentProgress | null; error: string | null }> {
  const { data, error } = await supabase
    .from('student_progress')
    .upsert(
      {
        user_id: userId,
        pathway_id: pathwayId,
        ...updates,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id,pathway_id',
      }
    )
    .select()
    .single();

  if (error) {
    return { progress: null, error: error.message };
  }

  return { progress: data, error: null };
}

// Start a pathway
export async function startPathway(
  userId: string,
  pathwayId: string
): Promise<{ progress: StudentProgress | null; error: string | null }> {
  return upsertProgress(userId, pathwayId, {
    status: 'in_progress',
    started_at: new Date().toISOString(),
    current_step: 0,
  });
}

// Update progress on a pathway
export async function updateProgress(
  userId: string,
  pathwayId: string,
  step: number,
  decisions: Record<string, string | number | boolean>,
  completionPercentage: number
): Promise<{ progress: StudentProgress | null; error: string | null }> {
  const status: ProgressStatus = completionPercentage >= 100 ? 'completed' : 'in_progress';

  return upsertProgress(userId, pathwayId, {
    status,
    current_step: step,
    decisions_made: decisions,
    completion_percentage: completionPercentage,
    completed_at: status === 'completed' ? new Date().toISOString() : null,
  });
}

// Get progress summary (counts by status)
export async function getProgressSummary(
  userId: string
): Promise<{ notStarted: number; inProgress: number; completed: number }> {
  const progress = await getUserProgress(userId);

  return {
    notStarted: progress.filter((p) => p.status === 'not_started').length,
    inProgress: progress.filter((p) => p.status === 'in_progress').length,
    completed: progress.filter((p) => p.status === 'completed').length,
  };
}
