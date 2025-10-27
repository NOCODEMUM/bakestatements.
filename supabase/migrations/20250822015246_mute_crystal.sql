/*
  # Create mailing list table

  1. New Tables
    - `mailing_list`
      - `id` (uuid, primary key)
      - `email` (text, unique, not null)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on `mailing_list` table
    - Add policy for public users to insert emails
    - Add policy for authenticated users to read emails
*/

CREATE TABLE IF NOT EXISTS mailing_list (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE mailing_list ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit their email to the mailing list
CREATE POLICY "Anyone can submit email to mailing list"
  ON mailing_list
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Only authenticated users can view the mailing list
CREATE POLICY "Authenticated users can view mailing list"
  ON mailing_list
  FOR SELECT
  TO authenticated
  USING (true);