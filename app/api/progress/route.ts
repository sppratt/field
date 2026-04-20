import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/client';

// GET: Fetch user's progress for a specific pathway
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { updateProgress, startPathway } = await import('@/lib/db/progress');

    const { searchParams } = new URL(request.url);
    const pathwayId = searchParams.get('pathwayId');

    if (!pathwayId) {
      return NextResponse.json({ error: 'pathwayId required' }, { status: 400 });
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('student_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('pathway_id', pathwayId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return NextResponse.json({ progress: data || null });
  } catch (error: any) {
    console.error('Error fetching progress:', error);
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }
}

// POST: Update progress on a pathway
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { updateProgress, startPathway, getUserProgress } = await import('@/lib/db/progress');
    const { evaluateAndAwardAchievements } = await import('@/lib/db/achievements');
    const { updateExplorationStreak } = await import('@/lib/db/achievements');

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { pathwayId, step, decisions, completionPercentage, action } = await request.json();

    if (!pathwayId) {
      return NextResponse.json({ error: 'pathwayId required' }, { status: 400 });
    }

    let result;

    if (action === 'start') {
      result = await startPathway(user.id, pathwayId);
    } else {
      result = await updateProgress(
        user.id,
        pathwayId,
        step || 0,
        decisions || {},
        completionPercentage || 0
      );
    }

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ progress: result.progress });
  } catch (error: any) {
    console.error('Error updating progress:', error);
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
}
