import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getAllFieldProgress, startField } from '@/lib/db/fieldProgress';

const FIELDS = [
  'software-engineer',
  'nurse',
  'graphic-designer',
  'data-analyst',
  'architect',
];

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

    const progress = await getAllFieldProgress(user.id);

    // Build complete field list with progress
    const allFields = FIELDS.map(fieldId => {
      const fieldProgress = progress.find(p => p.field_id === fieldId);
      return fieldProgress || {
        field_id: fieldId,
        status: 'not_started',
        current_level: 0,
        levels_completed: [],
      };
    });

    return NextResponse.json({
      success: true,
      fields: allFields,
    });
  } catch (error) {
    console.error('Error fetching field progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { fieldId } = body;

    if (!fieldId || !FIELDS.includes(fieldId)) {
      return NextResponse.json(
        { error: 'Invalid field_id' },
        { status: 400 }
      );
    }

    const progress = await startField(user.id, fieldId);

    if (!progress) {
      return NextResponse.json(
        { error: 'Failed to start field' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      progress,
      message: `Started ${fieldId}!`,
    });
  } catch (error) {
    console.error('Error starting field:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
