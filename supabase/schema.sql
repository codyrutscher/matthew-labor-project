-- Labor Pool Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- User roles enum
create type user_role as enum ('admin', 'staff', 'client', 'vendor');
create type staff_role as enum ('bartender', 'server', 'kitchen', 'coordinator', 'security');
create type staff_status as enum ('available', 'assigned', 'unavailable');
create type dispatch_status as enum ('pending', 'accepted', 'declined');
create type event_status as enum ('draft', 'open', 'live', 'completed');

-- Profiles table (extends Supabase auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  name text not null,
  role user_role not null default 'staff',
  phone text,
  created_at timestamptz default now()
);

-- Staff details (for users with role = 'staff')
create table staff_profiles (
  id uuid references profiles on delete cascade primary key,
  staff_roles staff_role[] not null default '{}',
  city text not null,
  status staff_status not null default 'available'
);

-- Events
create table events (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  date date not null,
  start_time time not null,
  end_time time not null,
  location text not null,
  city text not null,
  client_id uuid references profiles,
  vendor_id uuid references profiles,
  created_by uuid references profiles not null,
  status event_status not null default 'draft',
  created_at timestamptz default now()
);

-- Role requirements per event
create table event_role_requirements (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references events on delete cascade not null,
  role staff_role not null,
  quantity int not null default 1,
  unique(event_id, role)
);

-- Dispatch requests
create table dispatch_requests (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references events on delete cascade not null,
  staff_id uuid references profiles not null,
  staff_role staff_role not null,
  status dispatch_status not null default 'pending',
  sent_at timestamptz default now(),
  responded_at timestamptz
);

-- Chat messages
create table messages (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references events on delete cascade not null,
  sender_id uuid references profiles not null,
  content text not null,
  is_private boolean default false,
  private_recipient_id uuid references profiles,
  created_at timestamptz default now()
);

-- Staff invites
create table staff_invites (
  id uuid default uuid_generate_v4() primary key,
  email text not null,
  invited_by uuid references profiles not null,
  token text unique not null,
  accepted boolean default false,
  created_at timestamptz default now(),
  expires_at timestamptz default (now() + interval '7 days')
);

-- Indexes for performance
create index idx_staff_city on staff_profiles(city);
create index idx_staff_status on staff_profiles(status);
create index idx_events_city on events(city);
create index idx_events_date on events(date);
create index idx_events_status on events(status);
create index idx_dispatch_event on dispatch_requests(event_id);
create index idx_dispatch_staff on dispatch_requests(staff_id);
create index idx_dispatch_status on dispatch_requests(status);
create index idx_messages_event on messages(event_id);

-- Row Level Security (RLS)
alter table profiles enable row level security;
alter table staff_profiles enable row level security;
alter table events enable row level security;
alter table event_role_requirements enable row level security;
alter table dispatch_requests enable row level security;
alter table messages enable row level security;
alter table staff_invites enable row level security;

-- RLS Policies

-- Profiles: users can read all, update own
create policy "Profiles are viewable by authenticated users" on profiles
  for select using (auth.role() = 'authenticated');

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

-- Staff profiles: viewable by all authenticated
create policy "Staff profiles viewable by authenticated" on staff_profiles
  for select using (auth.role() = 'authenticated');

create policy "Staff can update own profile" on staff_profiles
  for update using (auth.uid() = id);

-- Events: viewable by all authenticated, editable by admin/creator
create policy "Events viewable by authenticated" on events
  for select using (auth.role() = 'authenticated');

create policy "Admins can manage events" on events
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- Dispatch requests: staff sees own, admin sees all
create policy "Staff sees own dispatch requests" on dispatch_requests
  for select using (staff_id = auth.uid());

create policy "Admins see all dispatch requests" on dispatch_requests
  for select using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can manage dispatch requests" on dispatch_requests
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create policy "Staff can update own dispatch status" on dispatch_requests
  for update using (staff_id = auth.uid());

-- Messages: participants can read event messages
create policy "Event participants can read messages" on messages
  for select using (
    auth.role() = 'authenticated' and (
      -- Admin can see all
      exists (select 1 from profiles where id = auth.uid() and role = 'admin')
      -- Or user is assigned to event
      or exists (
        select 1 from dispatch_requests 
        where event_id = messages.event_id 
        and staff_id = auth.uid() 
        and status = 'accepted'
      )
      -- Or user is client/vendor for event
      or exists (
        select 1 from events 
        where id = messages.event_id 
        and (client_id = auth.uid() or vendor_id = auth.uid())
      )
    )
  );

create policy "Participants can send messages" on messages
  for insert with check (sender_id = auth.uid());

-- Enable realtime for messages
alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table dispatch_requests;
