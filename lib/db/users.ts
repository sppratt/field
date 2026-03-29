import { createClient } from '@/utils/supabase/client';
import type { User, SignUpData, LogInData } from './types';

const supabase = createClient();

// Get user profile by ID
export async function getUser(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }

  return data;
}

// Get current user's profile
export async function getCurrentUserProfile(): Promise<User | null> {
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  return getUser(authUser.id);
}

// Sign up new user
export async function signUp(data: SignUpData): Promise<{ user: User | null; error: string | null }> {
  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });

  if (authError || !authData.user) {
    return { user: null, error: authError?.message || 'Failed to create account' };
  }

  // Create user profile
  const { data: userData, error: userError } = await supabase
    .from('users')
    .insert([
      {
        id: authData.user.id,
        email: data.email,
        name: data.name,
        role: data.role,
      },
    ])
    .select()
    .single();

  if (userError) {
    // Clean up auth user if profile creation failed
    await supabase.auth.admin.deleteUser(authData.user.id);
    return { user: null, error: userError.message };
  }

  return { user: userData, error: null };
}

// Log in user
export async function logIn(data: LogInData): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

// Log out user
export async function logOut(): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

// Update user profile
export async function updateUserProfile(
  userId: string,
  updates: Partial<User>
): Promise<{ user: User | null; error: string | null }> {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    return { user: null, error: error.message };
  }

  return { user: data, error: null };
}
