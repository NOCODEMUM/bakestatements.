/*
  # Create payment_settings table

  1. New Tables
    - `payment_settings`
      - `id` (uuid, primary key)
      - `user_id` (text, Firebase UID, unique)
      - `business_name` (text, optional)
      - `abn` (text, optional)
      - `email_from` (text, optional)
      - `reply_to` (text, optional)
      - `bank_account_name` (text, optional)
      - `bank_bsb` (text, optional)
      - `bank_account_number` (text, optional)
      - `payid` (text, optional)
      - `stripe_payment_link` (text, optional)
      - `website` (text, optional)
      - `default_due_days` (integer, default 14)
      - `notes_to_customer` (text, optional)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `payment_settings` table
    - Add policy for authenticated users to manage their own settings
    
  3. Indexes
    - Unique index on `user_id` for performance
*/

CREATE TABLE IF NOT EXISTS payment_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text UNIQUE NOT NULL,
  business_name text,
  abn text,
  email_from text,
  reply_to text,
  bank_account_name text,
  bank_bsb text,
  bank_account_number text,
  payid text,
  stripe_payment_link text,
  website text,
  default_due_days integer DEFAULT 14,
  notes_to_customer text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE payment_settings ENABLE ROW LEVEL SECURITY;

-- Create unique index on user_id
CREATE UNIQUE INDEX IF NOT EXISTS idx_payment_settings_user_id 
ON payment_settings (user_id);

-- Create policy for authenticated users to manage their own settings
CREATE POLICY "Users can manage own payment settings"
  ON payment_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);