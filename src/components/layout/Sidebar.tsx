'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamically import Clerk components to avoid SSR issues
const UserSection = dynamic(() => import('./UserSection'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center gap-3 px-2">
      <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse" />
      <div className="flex-1">
        <div className="h-4 bg-gray-700 rounded animate-pulse" />
      </div>
    </div>
  )
});

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

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold">The Expréss</h1>
        <p className="text-gray-400 text-sm">Labor Operations</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {allNavItems.map((item) => {
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
        <UserSection />
      </div>
    </aside>
  );
}
