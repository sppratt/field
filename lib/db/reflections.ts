import { createClient } from '@/utils/supabase/client';
import type { SimulationReflection } from './types';

const supabase = createClient();

export async function saveReflection(
  userId: string,
  pathwayId: string,
  questionType: 'surprise' | 'would_explore' | 'key_learning',
  response: string
): Promise<SimulationReflection | null> {
  try {
    const { data, error } = await supabase
      .from('simulation_reflections')
      .insert({
        user_id: userId,
        pathway_id: pathwayId,
        question_type: questionType,
        response: response,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving reflection:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Error in saveReflection:', err);
    return null;
  }
}

export async function getPathwayReflections(
  userId: string,
  pathwayId: string
): Promise<SimulationReflection[]> {
  try {
    const { data, error } = await supabase
      .from('simulation_reflections')
      .select('*')
      .eq('user_id', userId)
      .eq('pathway_id', pathwayId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reflections:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Error in getPathwayReflections:', err);
    return [];
  }
}

export async function getAllUserReflections(userId: string): Promise<SimulationReflection[]> {
  try {
    const { data, error } = await supabase
      .from('simulation_reflections')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all reflections:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Error in getAllUserReflections:', err);
    return [];
  }
}
