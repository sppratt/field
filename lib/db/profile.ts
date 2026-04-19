import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

interface UpdateProfileData {
  name?: string;
  interests?: string;
}

export async function updateUserProfile(userId: string, data: UpdateProfileData) {
  try {
    const { error } = await supabase
      .from('users')
      .update({
        name: data.name,
        interests: data.interests,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (err) {
    return { error: 'Failed to update profile' };
  }
}

export async function changePassword(currentPassword: string, newPassword: string) {
  try {
    // Update password using Supabase auth
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (err) {
    return { error: 'Failed to change password' };
  }
}
