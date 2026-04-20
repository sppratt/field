import { createClient } from '@/utils/supabase/client';
import type { PortfolioExport, StudentAchievement, StudentProgress, User } from './types';
import { getCurrentUserProfile } from './users';
import { getUserProgress } from './progress';
import { getUserAchievements } from './achievements';

const supabase = createClient();

function generateToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export async function createPortfolioExport(userId: string): Promise<PortfolioExport | null> {
  try {
    // Check if portfolio already exists
    const existing = await supabase
      .from('portfolio_exports')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!existing.error) {
      // Portfolio exists, update timestamp
      const { data, error } = await supabase
        .from('portfolio_exports')
        .update({
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating portfolio:', error);
        return null;
      }

      return data;
    }

    // Create new portfolio
    const token = generateToken();

    const { data, error } = await supabase
      .from('portfolio_exports')
      .insert({
        user_id: userId,
        public_token: token,
        is_public: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating portfolio:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Error in createPortfolioExport:', err);
    return null;
  }
}

export async function getPortfolioByToken(
  token: string
): Promise<{
  portfolio: PortfolioExport;
  user: Partial<User>;
  progress: StudentProgress[];
  achievements: StudentAchievement[];
} | null> {
  try {
    const { data: portfolio, error: portfolioError } = await supabase
      .from('portfolio_exports')
      .select('*')
      .eq('public_token', token)
      .eq('is_public', true)
      .single();

    if (portfolioError) {
      console.error('Error fetching portfolio:', portfolioError);
      return null;
    }

    // Fetch user profile (only name, role, created_at)
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, name, role, created_at')
      .eq('id', portfolio.user_id)
      .single();

    if (userError) {
      console.error('Error fetching user:', userError);
      return null;
    }

    // Fetch progress
    const { data: progress, error: progressError } = await supabase
      .from('student_progress')
      .select('*')
      .eq('user_id', portfolio.user_id);

    if (progressError) {
      console.error('Error fetching progress:', progressError);
      return null;
    }

    // Fetch achievements
    const { data: achievements, error: achievementsError } = await supabase
      .from('student_achievements')
      .select('*')
      .eq('user_id', portfolio.user_id);

    if (achievementsError) {
      console.error('Error fetching achievements:', achievementsError);
      return null;
    }

    return {
      portfolio,
      user: user || {},
      progress: progress || [],
      achievements: achievements || [],
    };
  } catch (err) {
    console.error('Error in getPortfolioByToken:', err);
    return null;
  }
}

export async function getPortfolioData(
  userId: string
): Promise<{
  summary: {
    totalPathways: number;
    completedPathways: number;
    exploredPathways: number;
    topSkill: string | null;
  };
  skills: Record<string, number>;
  topCareers: Array<{ title: string; matchPercentage: number }>;
  reflections: Array<{ pathway_id: string; response: string }>;
  token: string | null;
} | null> {
  try {
    // Fetch progress
    const progress = await getUserProgress(userId);

    // Fetch achievements
    const achievements = await getUserAchievements(userId);

    // Fetch portfolio token
    const { data: portfolio } = await supabase
      .from('portfolio_exports')
      .select('public_token')
      .eq('user_id', userId)
      .single();

    // Fetch reflections
    const { data: reflections } = await supabase
      .from('simulation_reflections')
      .select('pathway_id, response')
      .eq('user_id', userId)
      .limit(10);

    // Calculate tag scores
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

    // Find top skill
    const topSkill = Object.entries(tagScores).reduce((a, b) => (a[1] > b[1] ? a : b))[0] || null;

    // Summary stats
    const summary = {
      totalPathways: progress.length,
      completedPathways: progress.filter(p => p.status === 'completed').length,
      exploredPathways: progress.filter(p => p.status !== 'not_started').length,
      topSkill,
    };

    return {
      summary,
      skills: tagScores,
      topCareers: [], // Will be populated with career matching logic
      reflections: reflections || [],
      token: portfolio?.public_token || null,
    };
  } catch (err) {
    console.error('Error in getPortfolioData:', err);
    return null;
  }
}

export async function getOrCreatePortfolioToken(userId: string): Promise<string | null> {
  try {
    // Try to get existing portfolio
    const { data: existing } = await supabase
      .from('portfolio_exports')
      .select('public_token')
      .eq('user_id', userId)
      .single();

    if (existing) {
      return existing.public_token;
    }

    // Create new portfolio
    const portfolio = await createPortfolioExport(userId);
    return portfolio?.public_token || null;
  } catch (err) {
    console.error('Error in getOrCreatePortfolioToken:', err);
    return null;
  }
}
