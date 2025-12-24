import { auth, clerkClient } from '@clerk/nextjs/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !key) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createClient(url, key);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { token } = await req.json();

  if (!token) {
    return new Response('Missing token', { status: 400 });
  }

  const supabaseAdmin = getSupabaseAdmin();

  // Get invite
  const { data: invite, error: inviteError } = await supabaseAdmin
    .from('staff_invites')
    .select('*')
    .eq('token', token)
    .eq('accepted', false)
    .single();

  if (inviteError || !invite) {
    return new Response('Invalid or expired invite', { status: 400 });
  }

  // Check if expired
  if (new Date(invite.expires_at) < new Date()) {
    return new Response('Invite has expired', { status: 400 });
  }

  try {
    // Update user metadata in Clerk
    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: 'staff',
        staffRoles: invite.staff_roles,
        city: invite.city,
      },
    });

    // Mark invite as accepted
    await supabaseAdmin
      .from('staff_invites')
      .update({ accepted: true })
      .eq('token', token);

    return Response.json({ success: true });
  } catch (err) {
    console.error('Error completing onboarding:', err);
    return new Response('Failed to complete onboarding', { status: 500 });
  }
}
