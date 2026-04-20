import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getAggregateTagScores } from '@/lib/db/quizAttempts';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tagScores = await getAggregateTagScores(user.id);
    return NextResponse.json({ tagScores });
  } catch (error) {
    console.error('Error fetching tag scores:', error);
    return NextResponse.json({ error: 'Failed to fetch tag scores' }, { status: 500 });
  }
}
