-- Migration: Baseline Structure (Storage & Constraints)
-- Compiled from previous manual improvements

-- 1. Storage: Make the bucket public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'resumes';

-- 2. Storage: Add public SELECT policy for resume downloads
DROP POLICY IF EXISTS "Public resume access" ON storage.objects;

CREATE POLICY "Public resume access"
ON storage.objects 
FOR SELECT 
TO public
USING (bucket_id = 'resumes');

-- 3. Constraints: Link applications to profiles for referential integrity
-- Ensures applications are linked to profiles and cleaned up if a profile is deleted.
ALTER TABLE applications
DROP CONSTRAINT IF EXISTS applications_seeker_id_fkey,
ADD CONSTRAINT applications_seeker_id_fkey
FOREIGN KEY (seeker_id)
REFERENCES profiles(id)
ON DELETE CASCADE;
