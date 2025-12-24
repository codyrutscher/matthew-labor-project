-- Labor Pool Database Schema (Clerk Auth Version)
-- Run this in your Supabase SQL Editor

-- Drop existing tables if they exist (for fresh start)
drop table if exists staff_invites cascade;
drop table if exists messages cascade;
drop table if exists dispatch_requests cascade;
drop table if exists event_role_requirements cascade;
drop table if exists events cascade;
drop table if exists staff_profiles cascade;
drop table if exists profiles cascade;

-- Drop existing types
drop type if exists user_role cascade;
drop type if exists staff_role cascade;
drop type if exists staff_status cascade;
drop type if exists dispatch_status cascade;
drop type if exists event_status cascade;

-- User roles enum
create type user_role as enum ('admin', 'staff', 'client', 'vendor');
create type staff_role as enum ('bartender', 'server', 'kitchen', 'coordinator', 'security');
create type staff_status as enum ('available', 'assigned', 'unavailable');
create type dispatch_status as enum ('pending', 'accepted', 'declined');
create type event_status as enum ('draft', 'open', 'live', 'completed');

-- Profiles table (synced from Clerk via webhook)
-- Using TEXT for id since Clerk uses string IDs like "user_2abc123"
create table profiles (
  id text primary key,
  email text not null,
  name text not null,
  role user_role not null default 'staff',
  phone text,
  created_at timestamptz default now()
);

-- Staff details (for users with role = 'staff')
create table staff_profiles (
  id text references profiles on delete cascade primary key,
  staff_roles staff_role[] not null default '{}',
  city text not null,
  status staff_status not null default 'available'
);

-- Events
create table events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  date date not null,
  start_time time not null,
  end_time time not null,
  location text not null,
  city text not null,
  client_id text references profiles,
  vendor_id text references profiles,
  created_by text references profiles not null,
  status event_status not null default 'draft',
  created_at timestamptz default now()
);

-- Role requirements per event
create table event_role_requirements (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references events on delete cascade not null,
  role staff_role not null,
  quantity int not null default 1,
  unique(event_id, role)
);

-- Dispatch requests
create table dispatch_requests (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references events on delete cascade not null,
  staff_id text references profiles not null,
  staff_role staff_role not null,
  status dispatch_status not null default 'pending',
  sent_at timestamptz default now(),
  responded_at timestamptz
);

-- Chat messages
create table messages (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references events on delete cascade not null,
  sender_id text references profiles not null,
  content text not null,
  is_private boolean default false,
  private_recipient_id text references profiles,
  created_at timestamptz default now()
);

-- Staff invites (for inviting new staff via email)
create table staff_invites (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  invited_by text references profiles not null,
  staff_roles staff_role[] not null default '{}',
  city text not null,
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

-- Profiles: authenticated users can read all profiles
create policy "Profiles are viewable by authenticated users" on profiles
  for select using (true);

-- Allow service role to insert/update profiles (for Clerk webhook)
create policy "Service role can manage profiles" on profiles
  for all using (true);

-- Staff profiles: viewable by all authenticated
create policy "Staff profiles viewable by all" on staff_profiles
  for select using (true);

create policy "Service role can manage staff profiles" on staff_profiles
  for all using (true);

-- Events: viewable by all authenticated
create policy "Events viewable by all" on events
  for select using (true);

create policy "Events manageable by admins and creators" on events
  for all using (true);

-- Event role requirements
create policy "Role requirements viewable by all" on event_role_requirements
  for select using (true);

create policy "Role requirements manageable" on event_role_requirements
  for all using (true);

-- Dispatch requests
create policy "Dispatch requests viewable" on dispatch_requests
  for select using (true);

create policy "Dispatch requests manageable" on dispatch_requests
  for all using (true);

-- Messages
create policy "Messages viewable" on messages
  for select using (true);

create policy "Messages insertable" on messages
  for insert with check (true);

-- Staff invites
create policy "Invites viewable by admins" on staff_invites
  for select using (true);

create policy "Invites manageable" on staff_invites
  for all using (true);

-- Enable realtime for messages and dispatch_requests
alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table dispatch_requests;
