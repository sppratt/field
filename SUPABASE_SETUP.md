# Supabase Setup Guide for Field

## 1. Create a Supabase Project

1. Go to https://supabase.com
2. Sign up / log in
3. Create a new project
4. Note your:
   - Project URL (e.g., `https://xxxxx.supabase.co`)
   - Anon/Public API Key
   - Service Role Key (keep secret, server-side only)

## 2. Environment Variables

Create a `.env.local` file in the root directory:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx

SUPABASE_SERVICE_ROLE_KEY=xxxxx
```

The `NEXT_PUBLIC_` prefix means these are safe to expose to the browser. Never expose the service role key!

## 3. Create Database Tables

In the Supabase dashboard, go to SQL Editor and run this:

```sql
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (extends auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create student_progress table
CREATE TABLE public.student_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  pathway_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  current_step INTEGER DEFAULT 0,
  decisions_made JSONB DEFAULT '{}',
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, pathway_id)
);

-- Create RLS policies for users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Create RLS policies for student_progress table
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can read their own progress"
  ON public.student_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Students can update their own progress"
  ON public.student_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Students can insert their own progress"
  ON public.student_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_student_progress_user_id ON public.student_progress(user_id);
CREATE INDEX idx_student_progress_pathway_id ON public.student_progress(pathway_id);
CREATE INDEX idx_student_progress_status ON public.student_progress(status);
```

## 4. Configure Auth Settings

In Supabase dashboard → Authentication → Providers:

1. Enable Email auth (should be enabled by default)
2. Go to URL Configuration and add:
   - Site URL: `http://localhost:3000` (development)
   - Redirect URLs: `http://localhost:3000/auth/callback`

For production, update with your domain.

## 5. Test Connection

Once set up, the app will:
- Load Supabase client from environment variables
- Automatically create user records on signup
- Store progress as users interact with pathways
- Protect routes based on auth status
