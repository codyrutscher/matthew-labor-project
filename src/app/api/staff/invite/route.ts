import { auth } from '@clerk/nextjs/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { randomBytes } from 'crypto';

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

  const supabaseAdmin = getSupabaseAdmin();

  // Check if user is admin
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (profile?.role !== 'admin') {
    return new Response('Forbidden - Admin only', { status: 403 });
  }

  const body = await req.json();
  const { email, staffRoles, city } = body;

  if (!email || !staffRoles || !city) {
    return new Response('Missing required fields', { status: 400 });
  }

  // Generate unique invite token
  const token = randomBytes(32).toString('hex');

  // Create invite record
  const { data, error } = await supabaseAdmin
    .from('staff_invites')
    .insert({
      email,
      invited_by: userId,
      staff_roles: staffRoles,
      city,
      token,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating invite:', error);
    return new Response('Failed to create invite', { status: 500 });
  }

  // Generate invite URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const inviteUrl = `${baseUrl}/sign-up?token=${token}`;

  // In production, you'd send an email here
  // For now, return the URL
  return Response.json({
    success: true,
    inviteUrl,
    invite: data,
  });
}

export async function GET(req: Request) {
  const { userId } = await auth();
  
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const supabaseAdmin = getSupabaseAdmin();

  // Check if user is admin
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (profile?.role !== 'admin') {
    return new Response('Forbidden - Admin only', { status: 403 });
  }

  // Get all invites
  const { data, error } = await supabaseAdmin
    .from('staff_invites')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return new Response('Failed to fetch invites', { status: 500 });
  }

  return Response.json(data);
}
