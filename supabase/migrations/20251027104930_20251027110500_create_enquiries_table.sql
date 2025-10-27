/*
  # Create Enquiries Table

  1. New Tables
    - `enquiries`
      - `id` (uuid, primary key)
      - `landing_page_id` (uuid, references landing_pages)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `message` (text)
      - `event_date` (date)
      - `guest_count` (integer)
      - `status` (text) - new, contacted, quoted, confirmed, declined
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `enquiries` table
    - Allow anonymous users to submit enquiries (public form submission)
    - Landing page owners can view and manage enquiries for their pages
    - Prevent unauthorized access to other users' enquiries

  3. Important Notes
    - Public insert policy allows enquiry form submissions from anyone
    - Enquiries cascade delete with landing pages
    - Status tracking helps bakers manage their sales pipeline
*/

CREATE TABLE IF NOT EXISTS enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  landing_page_id uuid NOT NULL REFERENCES landing_pages(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  event_date date,
  guest_count integer,
  status text DEFAULT 'new' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit enquiries"
  ON enquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Landing page owners can view enquiries"
  ON enquiries FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM landing_pages
      WHERE landing_pages.id = enquiries.landing_page_id
      AND landing_pages.user_id = auth.uid()
    )
  );

CREATE POLICY "Landing page owners can update enquiries"
  ON enquiries FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM landing_pages
      WHERE landing_pages.id = enquiries.landing_page_id
      AND landing_pages.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM landing_pages
      WHERE landing_pages.id = enquiries.landing_page_id
      AND landing_pages.user_id = auth.uid()
    )
  );

CREATE POLICY "Landing page owners can delete enquiries"
  ON enquiries FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM landing_pages
      WHERE landing_pages.id = enquiries.landing_page_id
      AND landing_pages.user_id = auth.uid()
    )
  );

CREATE TRIGGER update_enquiries_updated_at BEFORE UPDATE ON enquiries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_enquiries_landing_page_id ON enquiries(landing_page_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON enquiries(created_at DESC);
