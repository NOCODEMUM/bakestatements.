/*
  # Add profile columns to profiles table

  1. New Columns
    - `business_name` (text, optional) - Store the user's business name
    - `phone_number` (text, optional) - Store the user's phone number  
    - `abn` (text, optional) - Store the user's Australian Business Number

  2. Changes
    - Add three new optional columns to the existing profiles table
    - All columns allow NULL values since they are optional profile information
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'business_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN business_name text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'phone_number'
  ) THEN
    ALTER TABLE profiles ADD COLUMN phone_number text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'abn'
  ) THEN
    ALTER TABLE profiles ADD COLUMN abn text;
  END IF;
END $$;