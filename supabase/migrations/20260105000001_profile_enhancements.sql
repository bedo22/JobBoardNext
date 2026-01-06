-- Migration: Profile Enhancements (AI-Bio & Socials)
-- Based on project dump 2026-01-06

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS skills text[], -- Mapping 'ARRAY' to 'text[]'
ADD COLUMN IF NOT EXISTS website_url text,
ADD COLUMN IF NOT EXISTS github_url text,
ADD COLUMN IF NOT EXISTS linkedin_url text,
ADD COLUMN IF NOT EXISTS twitter_url text;
