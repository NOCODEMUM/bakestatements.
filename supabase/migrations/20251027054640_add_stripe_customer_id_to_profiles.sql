/*
  # Add Stripe Customer ID to Profiles

  1. Changes
    - Add `stripe_customer_id` column to profiles table to store Stripe customer references
  
  2. Notes
    - This column is needed for the Stripe checkout integration
    - It will be populated when users first create a checkout session
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'stripe_customer_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN stripe_customer_id text;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON profiles(stripe_customer_id);
