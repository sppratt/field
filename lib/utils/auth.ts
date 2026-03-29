import { supabase } from '@/lib/supabase/client';

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return !!user;
}

// Get auth state (user + session)
export async function getAuthState() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return { user, session };
}

// Hook to listen to auth changes (for client components)
export function onAuthStateChange(callback: (user: any) => void) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user || null);
  });

  return subscription;
}
