import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Add fake architect level attempts with tag effects for demo
    const fakeAttempts = [
      {
        user_id: user.id,
        field_id: 'architect',
        level: 1,
        attempt_number: 1,
        score: 95,
        decisions_made: [
          { step: 0, choiceId: 'c2', tagEffects: { analytical: 2, creative: 2, hands_on: 0, social: 1, problem_solving: 1 } },
          { step: 1, choiceId: 'c2', tagEffects: { analytical: 2, creative: 0, hands_on: 1, social: 1, problem_solving: 2 } },
          { step: 2, choiceId: 'c2', tagEffects: { analytical: 2, creative: 1, hands_on: 1, social: 2, problem_solving: 2 } },
        ],
        unlocked_next_level: true,
        completed_at: new Date().toISOString(),
      },
      {
        user_id: user.id,
        field_id: 'architect',
        level: 2,
        attempt_number: 1,
        score: 88,
        decisions_made: [
          { step: 0, choiceId: 'c2', tagEffects: { analytical: 2, creative: 2, hands_on: 0, social: 1, problem_solving: 2 } },
          { step: 1, choiceId: 'c2', tagEffects: { analytical: 1, creative: 1, hands_on: 0, social: 2, problem_solving: 2 } },
          { step: 2, choiceId: 'c2', tagEffects: { analytical: 2, creative: 0, hands_on: 0, social: 1, problem_solving: 2 } },
        ],
        unlocked_next_level: true,
        completed_at: new Date().toISOString(),
      },
      {
        user_id: user.id,
        field_id: 'architect',
        level: 3,
        attempt_number: 1,
        score: 92,
        decisions_made: [
          { step: 0, choiceId: 'c2', tagEffects: { analytical: 2, creative: 1, hands_on: 0, social: 1, problem_solving: 2 } },
          { step: 1, choiceId: 'c2', tagEffects: { analytical: 2, creative: 1, hands_on: 2, social: 0, problem_solving: 2 } },
          { step: 2, choiceId: 'c2', tagEffects: { analytical: 2, creative: 1, hands_on: 1, social: 2, problem_solving: 2 } },
        ],
        unlocked_next_level: true,
        completed_at: new Date().toISOString(),
      },
      {
        user_id: user.id,
        field_id: 'architect',
        level: 4,
        attempt_number: 1,
        score: 91,
        decisions_made: [
          { step: 0, choiceId: 'c2', tagEffects: { analytical: 2, creative: 2, hands_on: 1, social: 2, problem_solving: 2 } },
          { step: 1, choiceId: 'c2', tagEffects: { analytical: 2, creative: 0, hands_on: 0, social: 1, problem_solving: 2 } },
          { step: 2, choiceId: 'c2', tagEffects: { analytical: 2, creative: 1, hands_on: 2, social: 0, problem_solving: 2 } },
        ],
        unlocked_next_level: true,
        completed_at: new Date().toISOString(),
      },
      {
        user_id: user.id,
        field_id: 'architect',
        level: 5,
        attempt_number: 1,
        score: 96,
        decisions_made: [
          { step: 0, choiceId: 'c2', tagEffects: { analytical: 2, creative: 2, hands_on: 1, social: 1, problem_solving: 2 } },
          { step: 1, choiceId: 'c2', tagEffects: { analytical: 2, creative: 2, hands_on: 1, social: 2, problem_solving: 2 } },
          { step: 2, choiceId: 'c2', tagEffects: { analytical: 2, creative: 2, hands_on: 1, social: 2, problem_solving: 2 } },
        ],
        unlocked_next_level: true,
        completed_at: new Date().toISOString(),
      },
    ];

    const { data, error } = await supabase
      .from('student_level_attempts')
      .insert(fakeAttempts)
      .select();

    if (error) {
      console.error('Error seeding skills:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Skills seeded successfully',
      attempts: data?.length || 0
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to seed skills' }, { status: 500 });
  }
}
