'use client';

import dynamic from 'next/dynamic';

// Force client-side only rendering
const OnboardingClient = dynamic(() => import('./OnboardingClient'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p>Loading...</p>
    </div>
  ),
});

export default function OnboardingPage() {
  return <OnboardingClient />;
}
