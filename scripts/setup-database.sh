#!/bin/bash

# This script creates the required database tables for the Field platform
# Run this once to set up your Supabase database

echo "Setting up Field database tables..."
echo ""
echo "1. Go to https://supabase.com/dashboard"
echo "2. Select your project"
echo "3. Click 'SQL Editor' in the sidebar"
echo "4. Click 'New query'"
echo "5. Paste the SQL below and click 'Run'"
echo ""
echo "=========================================="
echo ""

cat << 'SQL'
-- Multi-Level Adaptive Quiz System Tables

-- Student field progress tracking
CREATE TABLE IF NOT EXISTS public.student_field_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  field_id VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'not_started',
  current_level INTEGER DEFAULT 0,
  levels_completed INTEGER[] DEFAULT '{}',
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, field_id)
);

-- Individual quiz attempts with scores
CREATE TABLE IF NOT EXISTS public.student_level_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  field_id VARCHAR(100) NOT NULL,
  level INTEGER NOT NULL,
  attempt_number INTEGER NOT NULL DEFAULT 1,
  score DECIMAL(5, 2) NOT NULL,
  decisions_made JSONB,
  unlocked_next_level BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, field_id, level, attempt_number)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_student_field_progress_user ON public.student_field_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_student_level_attempts_user ON public.student_level_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_student_level_attempts_field_level ON public.student_level_attempts(user_id, field_id, level);
SQL

echo ""
echo "=========================================="
echo ""
echo "After running the SQL, your quiz submissions should work!"
echo ""
