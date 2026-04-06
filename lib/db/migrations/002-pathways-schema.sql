-- Migration 002: Pathways & Simulations Schema
-- This migration creates tables for career pathways, simulations, and decision steps
-- Status: Reference only - not applied yet. Use when migrating from TypeScript data files to dynamic content.
-- Run manually via Supabase SQL editor when ready to migrate to database-backed content.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Pathways (Career data)
CREATE TABLE IF NOT EXISTS public.pathways (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL UNIQUE,
  level TEXT NOT NULL CHECK (level IN ('intro', 'intermediate', 'advanced')),
  overview TEXT NOT NULL,
  key_skills TEXT[] NOT NULL, -- Array of skill names
  typical_tasks TEXT[] NOT NULL, -- Array of tasks
  education_path TEXT NOT NULL,
  salary_entry_level TEXT NOT NULL,
  salary_experienced TEXT NOT NULL,
  salary_outlook TEXT NOT NULL,
  recommendation_tags TEXT[] NOT NULL, -- Array of tags: analytical, creative, hands_on, social, problem_solving
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Simulations (Scenario metadata)
CREATE TABLE IF NOT EXISTS public.simulations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pathway_id UUID NOT NULL REFERENCES public.pathways(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  intro TEXT NOT NULL,
  outcome_summary TEXT NOT NULL,
  estimated_time_minutes INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Simulation Steps (Decision steps within a simulation)
CREATE TABLE IF NOT EXISTS public.simulation_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  simulation_id UUID NOT NULL REFERENCES public.simulations(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  scenario TEXT NOT NULL,
  question TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Simulation Choices (Choice options within each step)
CREATE TABLE IF NOT EXISTS public.simulation_choices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  step_id UUID NOT NULL REFERENCES public.simulation_steps(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  feedback TEXT NOT NULL,
  tag_effects JSONB, -- Structure: { "analytical": 2, "creative": 1, ... }
  next_step INTEGER, -- Step number to branch to, NULL if end of simulation
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_simulations_pathway_id ON public.simulations(pathway_id);
CREATE INDEX IF NOT EXISTS idx_simulation_steps_simulation_id ON public.simulation_steps(simulation_id);
CREATE INDEX IF NOT EXISTS idx_simulation_choices_step_id ON public.simulation_choices(step_id);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.pathways ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulation_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulation_choices ENABLE ROW LEVEL SECURITY;

-- Pathways: Public read-only (all users can view)
CREATE POLICY "Pathways are readable by everyone" ON public.pathways
  FOR SELECT USING (true);

-- Simulations: Public read-only (all users can view)
CREATE POLICY "Simulations are readable by everyone" ON public.simulations
  FOR SELECT USING (true);

-- Simulation Steps: Public read-only (all users can view)
CREATE POLICY "Simulation steps are readable by everyone" ON public.simulation_steps
  FOR SELECT USING (true);

-- Simulation Choices: Public read-only (all users can view)
CREATE POLICY "Simulation choices are readable by everyone" ON public.simulation_choices
  FOR SELECT USING (true);

-- Admin write access (requires auth.uid() in admin role - configure as needed)
-- These are placeholder policies; adjust role checking based on your auth setup
CREATE POLICY "Admin can insert pathways" ON public.pathways
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin can update pathways" ON public.pathways
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin can delete pathways" ON public.pathways
  FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- Add similar policies for simulations, steps, and choices as needed

-- Seed data migration helper (run after tables are created)
-- This would import data from TypeScript files via a migration script

-- CREATE FUNCTION migrate_pathways_from_typescript() RETURNS void AS $$
-- BEGIN
--   -- Insert pathway data here
-- END;
-- $$ LANGUAGE plpgsql;

-- Notes:
-- 1. This schema is designed to be compatible with the TypeScript data structures
-- 2. JSONB tag_effects column matches the TagEffects interface
-- 3. RLS policies enforce public read access for MVP
-- 4. Admin write access requires proper authentication role setup
-- 5. Foreign keys cascade on delete to maintain referential integrity
