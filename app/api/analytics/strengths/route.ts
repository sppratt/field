import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getAllFieldProgress } from '@/lib/db/fieldProgress';
import { getFieldAttempts } from '@/lib/db/quizAttempts';
import { getEmergingStrengths, calculateAggregateTagScores } from '@/app/utils/analyticsHelpers';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all fields the user has started
    const fieldProgress = await getAllFieldProgress(user.id);
    const startedFields = fieldProgress
      .filter(f => f.status !== 'not_started')
      .map(f => f.field_id);

    // Collect attempts from all fields
    const allAttempts = await Promise.all(
      startedFields.map(fieldId => getFieldAttempts(user.id, fieldId))
    );

    // Split into recent and older attempts
    const now = Date.now();
    const twoWeeksAgo = now - 14 * 24 * 60 * 60 * 1000;

    const recentAttempts = allAttempts
      .flat()
      .filter(a => new Date(a.completed_at).getTime() > twoWeeksAgo);

    const olderAttempts = allAttempts
      .flat()
      .filter(a => new Date(a.completed_at).getTime() <= twoWeeksAgo);

    // Calculate emerging strengths
    const emerging = getEmergingStrengths(recentAttempts, olderAttempts);

    // Calculate aggregate scores
    const topSkills = calculateAggregateTagScores(allAttempts.flat());

    // Sort by total score
    const sortedSkills = Object.entries(topSkills)
      .sort(([, a], [, b]) => b - a)
      .map(([tag, score]) => ({ tag, score }));

    return NextResponse.json({
      success: true,
      emergingStrengths: emerging,
      topSkills: sortedSkills,
      insights: {
        total_attempts: allAttempts.flat().length,
        fields_started: startedFields.length,
        trending_up: emerging.filter(e => e.trend === 'increasing').map(e => e.tag),
      },
    });
  } catch (error) {
    console.error('Error getting emerging strengths:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
