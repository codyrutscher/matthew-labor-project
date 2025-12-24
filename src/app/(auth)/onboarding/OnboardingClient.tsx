'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { StaffRole } from '@/types';

export default function OnboardingClient() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [invite, setInvite] = useState<{
    email: string;
    staff_roles: StaffRole[];
    city: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function validateInvite() {
      if (!token) {
        setError('Invalid invite link');
        setLoading(false);
        return;
      }

      const supabase = createClient();
      const { data, error } = await supabase
        .from('staff_invites')
        .select('*')
        .eq('token', token)
        .eq('accepted', false)
        .single();

      if (error || !data) {
        setError('Invite not found or already used');
        setLoading(false);
        return;
      }

      // Check if expired
      if (new Date(data.expires_at) < new Date()) {
        setError('This invite has expired');
        setLoading(false);
        return;
      }

      setInvite(data);
      setLoading(false);
    }

    validateInvite();
  }, [token]);

  const handleComplete = async () => {
    if (!user || !invite || !token) return;

    setSubmitting(true);

    try {
      const res = await fetch('/api/staff/complete-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (res.ok) {
        router.push('/dashboard');
      } else {
        setError('Failed to complete onboarding');
        setSubmitting(false);
      }
    } catch (err) {
      setError('Failed to complete onboarding');
      setSubmitting(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="py-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => router.push('/sign-in')}>
              Go to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-xl font-bold">Welcome to The Expréss!</h1>
          <p className="text-gray-600">Complete your staff profile</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-gray-900">{user?.emailAddresses[0]?.emailAddress}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Assigned Roles</label>
            <div className="mt-1 flex flex-wrap gap-2">
              {invite?.staff_roles.map(role => (
                <span key={role} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm capitalize">
                  {role}
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <p className="mt-1 text-gray-900">{invite?.city}</p>
          </div>

          <Button onClick={handleComplete} className="w-full" disabled={submitting}>
            {submitting ? 'Setting up...' : 'Complete Registration'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
