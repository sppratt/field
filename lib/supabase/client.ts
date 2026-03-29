import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey);
}

// Helper to get current session
export async function getSession() {
  if (!isSupabaseConfigured()) {
    return null;
  }
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

// Helper to get current user
export async function getCurrentUser() {
  if (!isSupabaseConfigured()) {
    return null;
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
