-- Migration: Secure Job View Tracking
-- Applied on: 2026-01-06

-- 1. Add views column
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- 2. Create secure increment function (RPC)
-- This allows anonymous/public users to increment a view count 
-- without needing full UPDATE permissions on the jobs table.
create or replace function increment_view_count(job_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update jobs
  set views = views + 1
  where id = job_id;
end;
$$;
