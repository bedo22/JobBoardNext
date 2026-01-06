-- Migration: Real-time Notification System
-- Applied on: 2026-01-06

-- 1. Create table
create table if not exists notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  type text not null, -- 'status_change', 'new_message', 'system'
  title text not null,
  message text not null,
  link text, 
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable RLS
alter table notifications enable row level security;

-- 3. Policy: Users can see their own notifications
create policy "Users can view their own notifications"
  on notifications for select
  using (auth.uid() = user_id);

-- 4. Policy: Users can update (mark as read) their own notifications
create policy "Users can update their own notifications"
  on notifications for update
  using (auth.uid() = user_id);

-- 5. Enable Realtime
alter publication supabase_realtime add table notifications;
