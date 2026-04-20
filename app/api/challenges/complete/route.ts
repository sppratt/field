import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { completeChallenge } from '@/lib/db/challenges';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { challengeId, challengeType, weekOf } = await request.json();

    if (!challengeType || !weekOf) {
      return NextResponse.json(
        { error: 'Missing challengeType or weekOf' },
        { status: 400 }
      );
    }

    const completed = await completeChallenge(user.id, challengeType, weekOf);

    if (!completed) {
      return NextResponse.json(
        { error: 'Failed to complete challenge' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, challenge: completed });
  } catch (error) {
    console.error('Error completing challenge:', error);
    return NextResponse.json(
      { error: 'Failed to complete challenge' },
      { status: 500 }
    );
  }
}
