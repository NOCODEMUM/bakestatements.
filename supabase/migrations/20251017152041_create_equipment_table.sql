/*
  # Create Equipment Library Table

  ## Summary
  Creates a new table for storing baking equipment inventory with photos and detailed specifications.

  ## New Tables
  - `equipment`
    - `id` (uuid, primary key) - Unique identifier for each equipment item
    - `user_id` (uuid, foreign key) - References the user who owns this equipment
    - `title` (text, required) - Name of the equipment item (e.g., "9-inch Round Cake Pan")
    - `photo_url` (text, optional) - URL to the equipment photo in Supabase storage
    - `size` (text, optional) - Dimensions or size specification (e.g., "9 inches diameter", "12x18 inches")
    - `material` (text, optional) - Material composition (e.g., "aluminum", "silicone", "stainless steel")
    - `quantity` (integer, optional) - Number of this item owned (defaults to 1)
    - `notes` (text, optional) - Additional notes or specifications
    - `category` (text, optional) - Equipment category for filtering (e.g., "Cake Pans", "Cookie Cutters")
    - `created_at` (timestamptz) - Timestamp of record creation
    - `updated_at` (timestamptz) - Timestamp of last update

  ## Security
  - Enable RLS on `equipment` table
  - Add policy for users to read their own equipment
  - Add policy for users to insert their own equipment
  - Add policy for users to update their own equipment
  - Add policy for users to delete their own equipment

  ## Storage
  - Creates a storage bucket for equipment photos with proper access policies
*/

-- Create the equipment table
CREATE TABLE IF NOT EXISTS equipment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  photo_url text,
  size text,
  material text,
  quantity integer DEFAULT 1,
  notes text,
  category text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS equipment_user_id_idx ON equipment(user_id);
CREATE INDEX IF NOT EXISTS equipment_category_idx ON equipment(category);

-- Enable Row Level Security
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own equipment
CREATE POLICY "Users can view own equipment"
  ON equipment FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own equipment
CREATE POLICY "Users can insert own equipment"
  ON equipment FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own equipment
CREATE POLICY "Users can update own equipment"
  ON equipment FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own equipment
CREATE POLICY "Users can delete own equipment"
  ON equipment FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create storage bucket for equipment photos (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('equipment-photos', 'equipment-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: Users can upload their own equipment photos
CREATE POLICY "Users can upload own equipment photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'equipment-photos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Storage policy: Anyone can view equipment photos (public bucket)
CREATE POLICY "Anyone can view equipment photos"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'equipment-photos');

-- Storage policy: Users can update their own equipment photos
CREATE POLICY "Users can update own equipment photos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'equipment-photos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Storage policy: Users can delete their own equipment photos
CREATE POLICY "Users can delete own equipment photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'equipment-photos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );