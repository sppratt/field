// Database types - match Supabase schema

export type UserRole = 'student' | 'teacher';

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  avatar_url: string | null;
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
