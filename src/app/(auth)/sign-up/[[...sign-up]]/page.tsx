import { SignUp } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

interface Props {
  searchParams: Promise<{ token?: string }>;
}

export default async function SignUpPage({ searchParams }: Props) {
  const params = await searchParams;
  const inviteToken = params.token;

  // If no invite token, redirect to sign-in
  // Staff can only sign up via invite link
  if (!inviteToken) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Join The Expréss</h1>
        <p className="text-gray-600 mt-2">Complete your staff registration</p>
      </div>
      <SignUp 
        afterSignUpUrl={`/onboarding?token=${inviteToken}`}
        appearance={{
          elements: {
            rootBox: "mx-auto",
          }
        }}
      />
    </div>
  );
}
