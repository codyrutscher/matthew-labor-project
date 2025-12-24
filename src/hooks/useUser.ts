'use client';

import { useUser as useClerkUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export type UserRole = 'admin' | 'staff' | 'client' | 'vendor';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  staffProfile?: {
    staff_roles: string[];
    city: string;
    status: 'available' | 'assigned' | 'unavailable';
  };
}

export function useUserProfile() {
  const { user, isLoaded } = useClerkUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      if (!isLoaded || !user) {
        setLoading(false);
        return;
      }

      const supabase = createClient();
      
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) {
        let fullProfile: UserProfile = profileData;

        if (profileData.role === 'staff') {
          const { data: staffData } = await supabase
            .from('staff_profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (staffData) {
            fullProfile = { ...profileData, staffProfile: staffData };
          }
        }

        setProfile(fullProfile);
      }

      setLoading(false);
    }

    fetchProfile();
  }, [user, isLoaded]);

  return {
    user,
    profile,
    role: profile?.role || null,
    isLoaded: isLoaded && !loading,
    isAdmin: profile?.role === 'admin',
    isStaff: profile?.role === 'staff',
    isClient: profile?.role === 'client',
    isVendor: profile?.role === 'vendor',
  };
}
