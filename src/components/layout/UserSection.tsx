'use client';

import { UserButton, useUser } from '@clerk/nextjs';
import { useUserProfile } from '@/hooks/useUser';

export default function UserSection() {
  const { user } = useUser();
  const { role, isLoaded } = useUserProfile();

  const getRoleBadgeColor = (role: string | null) => {
    switch (role) {
      case 'admin': return 'bg-red-500';
      case 'vendor': return 'bg-purple-500';
      case 'client': return 'bg-green-500';
      case 'staff': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="flex items-center gap-3 px-2">
      <UserButton afterSignOutUrl="/sign-in" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">
          {user?.firstName || user?.emailAddresses?.[0]?.emailAddress || 'User'}
        </p>
        {isLoaded && role && (
          <span className={`inline-block px-2 py-0.5 text-xs rounded-full capitalize ${getRoleBadgeColor(role)}`}>
            {role}
          </span>
        )}
      </div>
    </div>
  );
}
