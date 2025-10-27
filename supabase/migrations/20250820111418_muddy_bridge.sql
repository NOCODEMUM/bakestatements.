/*
  # Create enquiries table

  1. New Tables
    - `enquiries`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, required)
      - `message` (text, required)
      - `status` (text, default 'New')
      - `user_id` (uuid, foreign key to profiles, nullable for public enquiries)
      - `created_at` (timestamp)
      
  2. Security
    - Enable RLS on `enquiries` table
    - Add policy for anonymous users to insert enquiries
    - Add policy for authenticated users to view their own enquiries
*/

CREATE TABLE IF NOT EXISTS enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Quoted', 'Archived')),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert enquiries (public form)
CREATE POLICY "Anyone can submit enquiries"
  ON enquiries
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow authenticated users to view enquiries where they are the target baker
CREATE POLICY "Users can view enquiries for their business"
  ON enquiries
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR user_id IS NULL);

-- Allow authenticated users to update enquiry status
CREATE POLICY "Users can update enquiry status"
  ON enquiries
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() OR user_id IS NULL)
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);