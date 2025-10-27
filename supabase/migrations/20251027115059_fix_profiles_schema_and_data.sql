/*
  # Fix Profiles Table Schema and Data

  1. Schema Changes
    - Update `subscription_status` default from 'trial' to 'free_trial' to match frontend expectations
    - Ensure `trial_end_date` is NOT NULL with proper default
    - Ensure `subscription_status` is NOT NULL

  2. Data Migration
    - Update all existing records with subscription_status='trial' to 'free_trial'
    - Ensure all existing records have a trial_end_date set

  3. Important Notes
    - This fixes the login issue where authenticated users cannot proceed after email confirmation
    - Frontend code expects subscription_status values: 'free_trial', 'active', 'lifetime'
    - Database currently has 'trial' which doesn't match frontend expectations
*/

-- First, update existing data to match frontend expectations
UPDATE profiles
SET subscription_status = 'free_trial'
WHERE subscription_status = 'trial';

-- Ensure all profiles have a trial_end_date
UPDATE profiles
SET trial_end_date = now() + interval '7 days'
WHERE trial_end_date IS NULL;

-- Now update the schema to prevent future mismatches
ALTER TABLE profiles 
  ALTER COLUMN trial_end_date SET NOT NULL,
  ALTER COLUMN trial_end_date SET DEFAULT (now() + interval '7 days');

ALTER TABLE profiles 
  ALTER COLUMN subscription_status SET NOT NULL,
  ALTER COLUMN subscription_status SET DEFAULT 'free_trial';
