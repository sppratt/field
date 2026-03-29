import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const { supabase } = await import('@/lib/supabase/client');
    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to logout: Supabase not configured' },
      { status: 500 }
    );
  }
}
