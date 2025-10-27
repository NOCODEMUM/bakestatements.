/*
  # Create Profiles Table

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, not null)
      - `business_name` (text)
      - `phone_number` (text)
      - `abn` (text)
      - `logo_url` (text)
      - `subscription_status` (text, default 'free_trial')
      - `subscription_tier` (text)
      - `trial_end_date` (timestamptz, default now + 7 days)
      - `stripe_customer_id` (text)
      - `created_at` (timestamptz, default now)
      - `updated_at` (timestamptz, default now)

  2. Security
    - Enable RLS on `profiles` table
    - Add policy for users to view their own profile
    - Add policy for users to insert their own profile
    - Add policy for users to update their own profile

  3. Important Notes
    - Column name is `trial_end_date` to match frontend expectations
    - Default subscription status is 'free_trial'
    - Trial period is 7 days by default
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  business_name text,
  phone_number text,
  abn text,
  logo_url text,
  subscription_status text DEFAULT 'free_trial' NOT NULL,
  subscription_tier text,
  trial_end_date timestamptz DEFAULT (now() + interval '7 days') NOT NULL,
  stripe_customer_id text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
