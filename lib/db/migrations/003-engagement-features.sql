-- Engagement Features: Achievements, Reflections, Challenges, Portfolio, Streaks

-- Achievement tracking table
CREATE TABLE IF NOT EXISTS public.student_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  achievement_type VARCHAR(50) NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB,
  UNIQUE(user_id, achievement_type),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Reflection responses table
CREATE TABLE IF NOT EXISTS public.simulation_reflections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  pathway_id VARCHAR(100) NOT NULL,
  question_type VARCHAR(50) NOT NULL,
  response TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Challenge tracking table
CREATE TABLE IF NOT EXISTS public.student_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  challenge_type VARCHAR(50) NOT NULL,
  week_of DATE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, challenge_type, week_of),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Portfolio exports table (log history + public tokens)
CREATE TABLE IF NOT EXISTS public.portfolio_exports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  public_token VARCHAR(32) UNIQUE NOT NULL,
  exported_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Exploration streaks tracking
CREATE TABLE IF NOT EXISTS public.exploration_streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
  current_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  max_streak INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_student_achievements_user ON public.student_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_simulation_reflections_user ON public.simulation_reflections(user_id);
CREATE INDEX IF NOT EXISTS idx_simulation_reflections_pathway ON public.simulation_reflections(user_id, pathway_id);
CREATE INDEX IF NOT EXISTS idx_student_challenges_user ON public.student_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_student_challenges_week ON public.student_challenges(user_id, week_of);
CREATE INDEX IF NOT EXISTS idx_portfolio_exports_user ON public.portfolio_exports(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_exports_token ON public.portfolio_exports(public_token);
CREATE INDEX IF NOT EXISTS idx_exploration_streaks_user ON public.exploration_streaks(user_id);

-- Row Level Security (RLS) Policies for Engagement Features
ALTER TABLE public.student_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulation_reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exploration_streaks ENABLE ROW LEVEL SECURITY;

-- Achievements: Users can read and insert their own achievements
CREATE POLICY achievements_read ON public.student_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY achievements_insert ON public.student_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Reflections: Users can manage their own reflections
CREATE POLICY reflections_read ON public.simulation_reflections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY reflections_insert ON public.simulation_reflections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY reflections_update ON public.simulation_reflections FOR UPDATE USING (auth.uid() = user_id);

-- Challenges: Users can read and update their own challenges
CREATE POLICY challenges_read ON public.student_challenges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY challenges_insert ON public.student_challenges FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY challenges_update ON public.student_challenges FOR UPDATE USING (auth.uid() = user_id);

-- Portfolio exports: Users can manage their own exports
CREATE POLICY portfolio_read ON public.portfolio_exports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY portfolio_insert ON public.portfolio_exports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY portfolio_update ON public.portfolio_exports FOR UPDATE USING (auth.uid() = user_id);

-- Streaks: Users can read and update their own streaks
CREATE POLICY streaks_read ON public.exploration_streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY streaks_insert ON public.exploration_streaks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY streaks_update ON public.exploration_streaks FOR UPDATE USING (auth.uid() = user_id);
