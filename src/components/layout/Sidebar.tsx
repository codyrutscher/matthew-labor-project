'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, useUser } from '@clerk/nextjs';
import { useUserProfile } from '@/hooks/useUser';

const allNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊', roles: ['admin', 'staff', 'client', 'vendor'] },
  { href: '/staff', label: 'Labor Pool', icon: '👥', roles: ['admin'] },
  { href: '/events', label: 'Events', icon: '📅', roles: ['admin', 'vendor', 'client'] },
  { href: '/dispatch', label: 'Dispatch Board', icon: '📋', roles: ['admin', 'staff', 'client', 'vendor'] },
  { href: '/chat', label: 'Messages', icon: '💬', roles: ['admin', 'staff', 'client', 'vendor'] },
  { href: '/jobs', label: 'My Jobs', icon: '🎯', roles: ['staff'] },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const { role, isLoaded } = useUserProfile();

  // Filter nav items based on user role
  const navItems = allNavItems.filter(item => 
    !role || item.roles.includes(role)
  );

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
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold">The Expréss</h1>
        <p className="text-gray-400 text-sm">Labor Operations</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-2">
          <UserButton afterSignOutUrl="/sign-in" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.firstName || user?.emailAddresses[0]?.emailAddress || 'User'}
            </p>
            {isLoaded && role && (
              <span className={`inline-block px-2 py-0.5 text-xs rounded-full capitalize ${getRoleBadgeColor(role)}`}>
                {role}
              </span>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
