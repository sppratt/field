-- Multi-Level Adaptive Quiz System
-- Replaces single-simulation model with 5-level progressive learning

-- Student progress tracking per field (replaces old student_progress for new flow)
CREATE TABLE IF NOT EXISTS public.student_field_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  field_id VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'not_started', -- 'not_started' | 'in_progress' | 'mastered'
  current_level INTEGER DEFAULT 0, -- 0-5, which level they're currently on (0 = not started)
  levels_completed INTEGER[] DEFAULT '{}', -- array of [1,2,3,...] completed levels
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, field_id)
);

-- Individual quiz attempts with scores and decisions
CREATE TABLE IF NOT EXISTS public.student_level_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  field_id VARCHAR(100) NOT NULL,
  level INTEGER NOT NULL, -- 1-5
  attempt_number INTEGER NOT NULL DEFAULT 1, -- which attempt is this
  score DECIMAL(5, 2) NOT NULL, -- 0-100
  decisions_made JSONB, -- {step_id: choice_id, ...} and tag effects
  unlocked_next_level BOOLEAN DEFAULT FALSE, -- did score >= 75%?
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, field_id, level, attempt_number)
);

-- Quiz templates (25 total: 5 fields × 5 levels)
CREATE TABLE IF NOT EXISTS public.quiz_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  field_id VARCHAR(100) NOT NULL,
  level INTEGER NOT NULL, -- 1-5
  title VARCHAR(255) NOT NULL,
  description TEXT,
  difficulty_level VARCHAR(20), -- 'basic' | 'intermediate' | 'advanced' | 'expert'
  quiz_data JSONB NOT NULL, -- steps, choices, tag effects, etc.
  min_mastery_score INTEGER DEFAULT 75, -- unlock threshold
  estimated_time_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(field_id, level)
);

-- Daily skill snapshots for analytics (velocity, patterns, trends)
CREATE TABLE IF NOT EXISTS public.student_skill_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  snapshot_date DATE NOT NULL,
  tag_scores JSONB, -- {analytical: 45, creative: 30, ...}
  field_engagement JSONB, -- {field_id: {level: 3, attempts: 2, time_spent_minutes: 45}, ...}
  decision_patterns JSONB, -- aggregate of choice types
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, snapshot_date)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_student_field_progress_user ON public.student_field_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_student_field_progress_status ON public.student_field_progress(user_id, status);
CREATE INDEX IF NOT EXISTS idx_student_field_progress_field ON public.student_field_progress(field_id);

CREATE INDEX IF NOT EXISTS idx_student_level_attempts_user ON public.student_level_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_student_level_attempts_field_level ON public.student_level_attempts(user_id, field_id, level);
CREATE INDEX IF NOT EXISTS idx_student_level_attempts_completed ON public.student_level_attempts(completed_at);

CREATE INDEX IF NOT EXISTS idx_quiz_templates_field_level ON public.quiz_templates(field_id, level);

CREATE INDEX IF NOT EXISTS idx_student_skill_snapshots_user ON public.student_skill_snapshots(user_id);
CREATE INDEX IF NOT EXISTS idx_student_skill_snapshots_date ON public.student_skill_snapshots(user_id, snapshot_date);
