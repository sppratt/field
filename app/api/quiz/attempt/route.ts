import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { recordAttempt, getBestAttempt } from '@/lib/db/quizAttempts';
import { getFieldProgress, updateFieldLevel } from '@/lib/db/fieldProgress';

const MASTERY_THRESHOLD = 75; // 75% required to unlock next level

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
    const { fieldId, level, choices } = body;

    if (!fieldId || !level || !choices) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate score from decisions
    let tagScores: Record<string, number> = {
      analytical: 0,
      creative: 0,
      hands_on: 0,
      social: 0,
      problem_solving: 0,
    };

    let totalPossible = 0;

    // Aggregate tag effects from all choices
    choices.forEach((choice: any) => {
      if (choice.tagEffects) {
        Object.entries(choice.tagEffects).forEach(([tag, points]) => {
          if (tag in tagScores) {
            tagScores[tag] += (points as number) || 0;
          }
          totalPossible += Math.abs((points as number) || 0);
        });
      }
    });

    // Calculate percentage score
    const maxPossibleScore = totalPossible > 0 ? totalPossible : 100;
    const actualScore = Object.values(tagScores).reduce((a, b) => Math.max(a + b, 0), 0);
    const score = (actualScore / maxPossibleScore) * 100;

    // Check if this unlocks next level
    const unlockedNext = score >= MASTERY_THRESHOLD;

    // Record the attempt
    const attempt = await recordAttempt(
      user.id,
      fieldId,
      level,
      score,
      { choices, tagScores, score },
      unlockedNext
    );

    if (!attempt) {
      return NextResponse.json(
        { error: 'Failed to record attempt' },
        { status: 500 }
      );
    }

    // If unlocked, update field progress
    if (unlockedNext) {
      await updateFieldLevel(user.id, fieldId, level + 1, true);
    }

    // Get best attempt for this level
    const bestAttempt = await getBestAttempt(user.id, fieldId, level);

    return NextResponse.json({
      success: true,
      attempt,
      score,
      unlockedNext,
      nextLevel: unlockedNext ? level + 1 : null,
      bestScore: bestAttempt?.score || score,
      message: unlockedNext
        ? `🎉 You've mastered Level ${level}! Unlocked Level ${level + 1}.`
        : `Keep practicing! You scored ${Math.round(score)}%. Need ${MASTERY_THRESHOLD}% to advance.`,
    });
  } catch (error) {
    console.error('Error processing quiz attempt:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
