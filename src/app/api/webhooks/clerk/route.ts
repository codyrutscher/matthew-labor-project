import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

// Use service role for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET to .env.local');
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Missing svix headers', { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return new Response('Webhook verification failed', { status: 400 });
  }

  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, public_metadata } = evt.data;
    
    const email = email_addresses[0]?.email_address;
    const name = [first_name, last_name].filter(Boolean).join(' ') || email;
    
    // Get role from public_metadata (set during invite or sign-up)
    // Default to 'staff' if not specified
    const role = (public_metadata?.role as string) || 'staff';

    // Create profile in Supabase
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id,
        email,
        name,
        role,
      });

    if (profileError) {
      console.error('Error creating profile:', profileError);
      return new Response('Error creating profile', { status: 500 });
    }

    // If staff, create staff_profile entry
    if (role === 'staff') {
      const city = (public_metadata?.city as string) || 'San Francisco';
      const staffRoles = (public_metadata?.staffRoles as string[]) || [];

      const { error: staffError } = await supabaseAdmin
        .from('staff_profiles')
        .insert({
          id,
          city,
          staff_roles: staffRoles,
          status: 'available',
        });

      if (staffError) {
        console.error('Error creating staff profile:', staffError);
      }
    }
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, public_metadata } = evt.data;
    
    const email = email_addresses[0]?.email_address;
    const name = [first_name, last_name].filter(Boolean).join(' ') || email;
    const role = (public_metadata?.role as string) || 'staff';

    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ email, name, role })
      .eq('id', id);

    if (error) {
      console.error('Error updating profile:', error);
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;

    // Cascade delete will handle staff_profiles
    const { error } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting profile:', error);
    }
  }

  return new Response('OK', { status: 200 });
}
