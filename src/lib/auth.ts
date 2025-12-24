import { auth, currentUser } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';

export type UserRole = 'admin' | 'staff' | 'client' | 'vendor';

export async function getCurrentUserRole(): Promise<UserRole | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  return data?.role || null;
}

export async function getCurrentUserProfile() {
  const { userId } = await auth();
  if (!userId) return null;

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (!profile) return null;

  // If staff, get additional staff profile data
  if (profile.role === 'staff') {
    const { data: staffProfile } = await supabase
      .from('staff_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    return { ...profile, staffProfile };
  }

  return profile;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const role = await getCurrentUserRole();
  
  if (!role || !allowedRoles.includes(role)) {
    throw new Error('Unauthorized');
  }

  return role;
}

// Check if user has permission for an action
export function canManageStaff(role: UserRole): boolean {
  return role === 'admin';
}

export function canDispatchStaff(role: UserRole): boolean {
  return role === 'admin';
}

export function canViewAllEvents(role: UserRole): boolean {
  return role === 'admin';
}

export function canCreateEvents(role: UserRole): boolean {
  return role === 'admin' || role === 'vendor';
}

export function canViewDispatchBoard(role: UserRole): boolean {
  return true; // All roles can view, but with different permissions
}
