/*
  # Fix Profiles RLS Policy for Signup

  1. Changes
    - Drop the overly restrictive "ALL" policy
    - Create separate policies for INSERT, SELECT, UPDATE, DELETE
    - Allow INSERT for authenticated users creating their own profile
    - Allow SELECT/UPDATE/DELETE only for users accessing their own profile
  
  2. Security
    - INSERT: Authenticated users can only insert their own profile (auth.uid() = id)
    - SELECT: Users can only read their own profile
    - UPDATE: Users can only update their own profile
    - DELETE: Users can only delete their own profile
*/

-- Drop the existing overly restrictive policy
DROP POLICY IF EXISTS "Users can manage own profile" ON profiles;

-- Create separate policies for each operation
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can select own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = id);