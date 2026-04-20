import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getDecisionPatterns } from '@/lib/db/quizAttempts';

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

    const url = new URL(request.url);
    const fieldId = url.searchParams.get('field_id');

    if (!fieldId) {
      return NextResponse.json(
        { error: 'Missing field_id query parameter' },
        { status: 400 }
      );
    }

    const patterns = await getDecisionPatterns(user.id, fieldId);

    // Find the dominant decision type
    const dominant = Object.entries(patterns).reduce((a, b) =>
      patterns[a[0]] > patterns[b[0]] ? a : b
    )?.[0];

    return NextResponse.json({
      success: true,
      fieldId,
      patterns,
      dominant,
      insight: `You favor ${dominant} decisions in ${fieldId}`,
    });
  } catch (error) {
    console.error('Error getting decision patterns:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
