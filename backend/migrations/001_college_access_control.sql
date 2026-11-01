-- ==============================================================================
-- CryptoCode: College-Based Registration and Access Control Migration
-- Migration: 001_college_access_control.sql
-- ==============================================================================

-- 1. Ensure the 'college' column exists in 'profiles' table
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS college TEXT;

-- 2. Safe Data Migration for Existing Users
-- Per Requirements:
-- - Existing accounts must be preserved.
-- - Do not automatically assign GPN to existing users.
-- - Existing users with NULL or non-GPN college are set to 'OTHER'.
-- - Users with explicit GPN variants are normalized to 'GPN'.

-- Normalize GPN variants
UPDATE profiles 
SET college = 'GPN'
WHERE LOWER(TRIM(college)) IN (
  'gpn',
  'government polytechnic, nashik',
  'government polytechnic',
  'gp nashik'
);

-- Backfill all remaining NULL or unassigned college profiles as 'OTHER'
UPDATE profiles 
SET college = 'OTHER' 
WHERE college IS NULL OR college NOT IN ('GPN', 'OTHER');

-- 3. Create Index on profiles(college) and profiles(role, college) for optimal filtering
CREATE INDEX IF NOT EXISTS idx_profiles_college ON profiles(college);
CREATE INDEX IF NOT EXISTS idx_profiles_role_college ON profiles(role, college);
