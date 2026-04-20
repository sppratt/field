import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { calculateFieldVelocity } from '@/lib/db/quizAttempts';

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

    const velocity = await calculateFieldVelocity(user.id, fieldId);

    return NextResponse.json({
      success: true,
      fieldId,
      velocity,
      summary: `${Object.values(velocity).filter(v => v !== null).length} levels completed`,
    });
  } catch (error) {
    console.error('Error calculating velocity:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
