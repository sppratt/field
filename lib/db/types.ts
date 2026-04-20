// Database types - match Supabase schema

export type UserRole = 'student' | 'teacher';

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  avatar_url: string | null;
  interests?: string | null;
  created_at: string;
  updated_at: string;
}

export type ProgressStatus = 'not_started' | 'in_progress' | 'completed';

export interface StudentProgress {
  id: string;
  user_id: string;
  pathway_id: string;
  status: ProgressStatus;
  started_at: string | null;
  completed_at: string | null;
  current_step: number;
  decisions_made: Record<string, string | number | boolean>;
  completion_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface LogInData {
  email: string;
  password: string;
}

export interface TeacherClass {
  id: string;
  teacher_id: string;
  class_name: string;
  class_code: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClassEnrollment {
  id: string;
  student_id: string;
  class_id: string;
  enrolled_at: string;
}

export interface ClassStudent {
  id: string;
  student_id: string;
  name: string | null;
  email: string;
  pathways_started: number;
  pathways_completed: number;
  completion_percentage: number;
  last_active: string | null;
}

export type AchievementType =
  | 'first_explorer'
  | 'thorough_investigator'
  | 'skill_specialist_analytical'
  | 'skill_specialist_creative'
  | 'skill_specialist_hands_on'
  | 'skill_specialist_social'
  | 'skill_specialist_problem_solving'
  | 'balanced_learner'
  | 'committed_explorer';

export interface StudentAchievement {
  id: string;
  user_id: string;
  achievement_type: AchievementType;
  earned_at: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface SimulationReflection {
  id: string;
  user_id: string;
  pathway_id: string;
  question_type: 'surprise' | 'would_explore' | 'key_learning';
  response: string;
  created_at: string;
  updated_at: string;
}

export interface StudentChallenge {
  id: string;
  user_id: string;
  challenge_type: 'weekly_new' | 'compare_careers' | 'skill_balance';
  week_of: string;
  completed: boolean;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ExplorationStreak {
  id: string;
  user_id: string;
  current_streak: number;
  last_activity_date: string | null;
  max_streak: number;
  updated_at: string;
  created_at: string;
}

export interface PortfolioExport {
  id: string;
  user_id: string;
  public_token: string;
  exported_at: string;
  updated_at: string;
  is_public: boolean;
  created_at: string;
}

export type FieldStatus = 'not_started' | 'in_progress' | 'mastered';

export interface StudentFieldProgress {
  id: string;
  user_id: string;
  field_id: string;
  status: FieldStatus;
  current_level: number; // 0-5
  levels_completed: number[]; // [1,2,3,...]
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface StudentLevelAttempt {
  id: string;
  user_id: string;
  field_id: string;
  level: number; // 1-5
  attempt_number: number;
  score: number; // 0-100
  decisions_made: Record<string, any>; // step_id -> choice_id, tag effects
  unlocked_next_level: boolean;
  completed_at: string;
  created_at: string;
}

export interface QuizStep {
  id: string;
  stepNumber: number;
  scenario: string;
  question: string;
  choices: QuizChoice[];
}

export interface QuizChoice {
  id: string;
  text: string;
  feedback: string;
  tagEffects: Record<string, number>;
  complexity?: 'basic' | 'intermediate' | 'advanced';
}

export interface QuizTemplate {
  id: string;
  field_id: string;
  level: number; // 1-5
  title: string;
  description?: string;
  difficulty_level: 'basic' | 'intermediate' | 'advanced' | 'expert';
  quiz_data: {
    steps: QuizStep[];
    minMasteryScore: number;
    estimatedTime: number;
  };
  min_mastery_score: number;
  estimated_time_minutes?: number;
  created_at: string;
  updated_at: string;
}

export type RecommendationTag = 'analytical' | 'creative' | 'hands_on' | 'social' | 'problem_solving';

export interface StudentSkillSnapshot {
  id: string;
  user_id: string;
  snapshot_date: string;
  tag_scores: Record<RecommendationTag, number>;
  field_engagement: Record<string, {
    level: number;
    attempts: number;
    time_spent_minutes: number;
  }>;
  decision_patterns: Record<string, number>;
  created_at: string;
}
