/*
  # Create Landing Pages and Equipment Tables

  1. New Tables
    - `landing_pages`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `slug` (text, unique) - URL-friendly identifier for baker's page
      - `business_name` (text)
      - `tagline` (text)
      - `description` (text)
      - `logo_url` (text)
      - `hero_image_url` (text)
      - `contact_email` (text)
      - `contact_phone` (text)
      - `instagram_url` (text)
      - `facebook_url` (text)
      - `custom_colors` (jsonb) - stores color theme customization
      - `is_published` (boolean) - controls public visibility
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `equipment`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `name` (text)
      - `category` (text)
      - `purchase_date` (date)
      - `purchase_price` (decimal)
      - `current_value` (decimal)
      - `depreciation_rate` (decimal)
      - `notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Landing pages have special public read policy when published
    - Equipment is private and only accessible to the owner
    - All mutations require authentication and ownership

  3. Important Notes
    - Published landing pages are publicly accessible via slug
    - Equipment tracking helps with ATO depreciation claims
    - Slugs must be unique across all users
*/

CREATE TABLE IF NOT EXISTS landing_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  slug text UNIQUE NOT NULL,
  business_name text NOT NULL,
  tagline text,
  description text,
  logo_url text,
  hero_image_url text,
  contact_email text,
  contact_phone text,
  instagram_url text,
  facebook_url text,
  custom_colors jsonb DEFAULT '{}',
  is_published boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS equipment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text,
  purchase_date date,
  purchase_price decimal(10,2) DEFAULT 0,
  current_value decimal(10,2) DEFAULT 0,
  depreciation_rate decimal(5,2) DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE landing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own landing pages"
  ON landing_pages FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view published landing pages"
  ON landing_pages FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "Users can insert own landing pages"
  ON landing_pages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own landing pages"
  ON landing_pages FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own landing pages"
  ON landing_pages FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own equipment"
  ON equipment FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own equipment"
  ON equipment FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own equipment"
  ON equipment FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own equipment"
  ON equipment FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER update_landing_pages_updated_at BEFORE UPDATE ON landing_pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_equipment_updated_at BEFORE UPDATE ON equipment
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_landing_pages_user_id ON landing_pages(user_id);
CREATE INDEX IF NOT EXISTS idx_landing_pages_slug ON landing_pages(slug);
CREATE INDEX IF NOT EXISTS idx_equipment_user_id ON equipment(user_id);
