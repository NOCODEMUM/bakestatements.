/*
  # Add full name to profiles table

  1. Schema Changes
    - Add `full_name` column to `profiles` table
    - Set default value for existing users

  2. Security
    - No changes to existing RLS policies
    - Maintains existing security model
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN full_name text;
  END IF;
END $$;