/*
  # Add Firebase UID to Profiles Table

  1. Schema Changes
    - Add `firebase_uid` column to `profiles` table
    - Column type: text (nullable, unique)
    - Purpose: Link Firebase authenticated users to Supabase profiles

  2. Security
    - Column is nullable to support existing users who don't have Firebase UIDs yet
    - Unique constraint ensures each Firebase user maps to only one profile
    - No RLS changes needed as existing policies will continue to work

  3. Migration Strategy
    - Safe migration using IF NOT EXISTS
    - Existing users will have NULL firebase_uid initially
    - New users will populate this field during signup process
*/

-- Add firebase_uid column to profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'firebase_uid'
  ) THEN
    ALTER TABLE profiles ADD COLUMN firebase_uid text;
  END IF;
END $$;

-- Add unique constraint on firebase_uid (only if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'profiles' AND constraint_name = 'profiles_firebase_uid_key'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_firebase_uid_key UNIQUE (firebase_uid);
  END IF;
END $$;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_firebase_uid ON profiles(firebase_uid);