import { createClient } from '@/utils/supabase/client';
import type { StudentAchievement, AchievementType, StudentProgress, ExplorationStreak } from './types';

const supabase = createClient();

export async function getUserAchievements(userId: string): Promise<StudentAchievement[]> {
  try {
    const { data, error } = await supabase
      .from('student_achievements')
      .select('*')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });

    if (error) {
      console.error('Error fetching achievements:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Error in getUserAchievements:', err);
    return [];
  }
}

export async function awardAchievement(
  userId: string,
  type: AchievementType,
  metadata?: Record<string, any>
): Promise<StudentAchievement | null> {
  try {
    const { data, error } = await supabase
      .from('student_achievements')
      .insert({
        user_id: userId,
        achievement_type: type,
        metadata: metadata || {},
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        // Unique constraint violation - achievement already awarded
        return null;
      }
      console.error('Error awarding achievement:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Error in awardAchievement:', err);
    return null;
  }
}

export async function evaluateAndAwardAchievements(
  userId: string,
  progress: StudentProgress[]
): Promise<StudentAchievement[]> {
  const awardedAchievements: StudentAchievement[] = [];

  try {
    // Calculate metrics from progress
    const completedCount = progress.filter(p => p.status === 'completed').length;
    const exploredCount = progress.filter(p => p.status !== 'not_started').length;
    const totalPathways = progress.length;

    const tagScores: Record<string, number> = {
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
                tagScores[tag] += scores[tag] || 0;
              }
            });
          }
        } catch (err) {
          console.error('Error parsing tag scores:', err);
        }
      }
    });

    // First Explorer: 1 completed pathway
    if (completedCount >= 1) {
      const achievement = await awardAchievement(userId, 'first_explorer');
      if (achievement) awardedAchievements.push(achievement);
    }

    // Thorough Investigator: Explored all 5 careers
    if (exploredCount === totalPathways && totalPathways >= 5) {
      const achievement = await awardAchievement(userId, 'thorough_investigator');
      if (achievement) awardedAchievements.push(achievement);
    }

    // Skill Specialists: Score > 15 in each skill
    const skillSpecialists: AchievementType[] = [
      'skill_specialist_analytical',
      'skill_specialist_creative',
      'skill_specialist_hands_on',
      'skill_specialist_social',
      'skill_specialist_problem_solving',
    ];

    for (let i = 0; i < skillSpecialists.length; i++) {
      const skillName = skillSpecialists[i].split('_')[2];
      if (tagScores[skillName] > 15) {
        const achievement = await awardAchievement(userId, skillSpecialists[i]);
        if (achievement) awardedAchievements.push(achievement);
      }
    }

    // Balanced Learner: All skills > 5
    const allSkillsBalanced = Object.values(tagScores).every(score => score > 5);
    if (allSkillsBalanced) {
      const achievement = await awardAchievement(userId, 'balanced_learner');
      if (achievement) awardedAchievements.push(achievement);
    }

    // Committed Explorer: 3+ completed pathways
    if (completedCount >= 3) {
      const achievement = await awardAchievement(userId, 'committed_explorer');
      if (achievement) awardedAchievements.push(achievement);
    }

    return awardedAchievements;
  } catch (err) {
    console.error('Error in evaluateAndAwardAchievements:', err);
    return awardedAchievements;
  }
}

export async function getExplorationStreak(userId: string): Promise<ExplorationStreak | null> {
  try {
    const { data, error } = await supabase
      .from('exploration_streaks')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found - return null
        return null;
      }
      console.error('Error fetching streak:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Error in getExplorationStreak:', err);
    return null;
  }
}

export async function updateExplorationStreak(userId: string): Promise<ExplorationStreak | null> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const streak = await getExplorationStreak(userId);

    let newStreak = 1;
    let maxStreak = 1;

    if (streak) {
      const lastActivityDate = streak.last_activity_date;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastActivityDate === today) {
        // Already active today, don't change streak
        newStreak = streak.current_streak;
      } else if (lastActivityDate === yesterdayStr) {
        // Continuing streak
        newStreak = streak.current_streak + 1;
      } else {
        // Streak broken, reset to 1
        newStreak = 1;
      }

      maxStreak = Math.max(newStreak, streak.max_streak);

      const { data, error } = await supabase
        .from('exploration_streaks')
        .update({
          current_streak: newStreak,
          last_activity_date: today,
          max_streak: maxStreak,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating streak:', error);
        return null;
      }

      return data;
    } else {
      // Create new streak record
      const { data, error } = await supabase
        .from('exploration_streaks')
        .insert({
          user_id: userId,
          current_streak: 1,
          last_activity_date: today,
          max_streak: 1,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating streak:', error);
        return null;
      }

      return data;
    }
  } catch (err) {
    console.error('Error in updateExplorationStreak:', err);
    return null;
  }
}
