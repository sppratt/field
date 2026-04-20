import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getFieldProgress } from '@/lib/db/fieldProgress';
import { allQuizTemplates } from '@/app/data/quizTemplates';
import { remainingQuizTemplates } from '@/app/data/quizTemplatesRemaining';

// Combine all templates
const allTemplates = [...allQuizTemplates, ...remainingQuizTemplates];

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
    const level = url.searchParams.get('level');

    if (!fieldId || !level) {
      return NextResponse.json(
        { error: 'Missing field_id or level query parameters' },
        { status: 400 }
      );
    }

    const levelNum = parseInt(level, 10);

    // Check if user has access to this level
    const fieldProgress = await getFieldProgress(user.id, fieldId);


    // Level 1 is always available if field is started
    // Higher levels require previous level to be completed
    if (levelNum > 1 && (!fieldProgress || !fieldProgress.levels_completed.includes(levelNum - 1))) {
      return NextResponse.json(
        { error: 'Level locked. Complete previous level first.' },
        { status: 403 }
      );
    }


    // Find the template
    const template = allTemplates.find(
      t => t.field_id === fieldId && t.level === levelNum
    );

    if (!template) {
      return NextResponse.json(
        { error: 'Quiz template not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      template,
    });
  } catch (error) {
    console.error('Error fetching quiz template:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
