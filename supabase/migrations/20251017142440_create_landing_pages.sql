/*
  # Create Landing Pages System

  ## Overview
  This migration creates the landing pages system that allows each baker to have a customizable
  public-facing landing page to showcase their work and capture enquiries.

  ## New Tables
  
  ### `landing_pages`
  - `id` (uuid, primary key) - Unique identifier for the landing page
  - `user_id` (uuid, foreign key) - References profiles table, owner of the landing page
  - `slug` (text, unique) - URL-friendly identifier based on business name
  - `is_active` (boolean) - Whether the landing page is published and public
  - `primary_color` (text) - Brand primary color (hex code)
  - `secondary_color` (text) - Brand secondary color (hex code)
  - `logo_url` (text) - Path to logo image in Supabase Storage
  - `hero_image_url` (text) - Path to hero/banner image in Supabase Storage
  - `business_tagline` (text) - Short catchy tagline for the business
  - `about_text` (text) - Longer description of the business
  - `gallery_images` (jsonb) - Array of image URLs showcasing work
  - `packages` (jsonb) - Array of quick purchase package offerings
  - `social_instagram` (text) - Instagram profile URL
  - `social_facebook` (text) - Facebook page URL
  - `social_other` (text) - Other social media link
  - `seo_title` (text) - Page title for SEO
  - `seo_description` (text) - Meta description for SEO
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on landing_pages table
  - Allow public to read active landing pages by slug
  - Allow authenticated users to read their own landing page
  - Allow authenticated users to create/update their own landing page
  - Restrict delete operations to page owners only

  ## Changes to Existing Tables
  - Add `package_selected` field to enquiries table to track package enquiries
  - Add `landing_page_id` field to enquiries table for source attribution

  ## Important Notes
  - Landing pages are inactive by default (is_active = false)
  - Slugs must be unique across all landing pages
  - Gallery images stored as JSONB array with structure: [{"url": "...", "alt": "...", "order": 1}]
  - Packages stored as JSONB array with structure: [{"name": "...", "description": "...", "price": 0, "image_url": "..."}]
  - Storage bucket for landing page assets will be created separately
*/

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create landing_pages table
CREATE TABLE IF NOT EXISTS landing_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT false,
  primary_color TEXT DEFAULT '#F59E0B',
  secondary_color TEXT DEFAULT '#14B8A6',
  logo_url TEXT,
  hero_image_url TEXT,
  business_tagline TEXT,
  about_text TEXT,
  gallery_images JSONB DEFAULT '[]'::jsonb,
  packages JSONB DEFAULT '[]'::jsonb,
  social_instagram TEXT,
  social_facebook TEXT,
  social_other TEXT,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add package tracking to enquiries table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'enquiries' AND column_name = 'package_selected'
  ) THEN
    ALTER TABLE enquiries ADD COLUMN package_selected TEXT;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'enquiries' AND column_name = 'landing_page_id'
  ) THEN
    ALTER TABLE enquiries ADD COLUMN landing_page_id UUID REFERENCES landing_pages(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_landing_pages_user ON landing_pages(user_id);
CREATE INDEX IF NOT EXISTS idx_landing_pages_slug ON landing_pages(slug);
CREATE INDEX IF NOT EXISTS idx_landing_pages_active ON landing_pages(is_active);
CREATE INDEX IF NOT EXISTS idx_enquiries_landing_page ON enquiries(landing_page_id);

-- Enable Row Level Security
ALTER TABLE landing_pages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for landing_pages

-- Public can view active landing pages
CREATE POLICY "Public can view active landing pages"
  ON landing_pages FOR SELECT
  USING (is_active = true);

-- Authenticated users can view their own landing page (active or not)
CREATE POLICY "Users can view own landing page"
  ON landing_pages FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Authenticated users can insert their own landing page
CREATE POLICY "Users can create own landing page"
  ON landing_pages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Authenticated users can update their own landing page
CREATE POLICY "Users can update own landing page"
  ON landing_pages FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Authenticated users can delete their own landing page
CREATE POLICY "Users can delete own landing page"
  ON landing_pages FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add trigger to update updated_at column
DROP TRIGGER IF EXISTS update_landing_pages_updated_at ON landing_pages;
CREATE TRIGGER update_landing_pages_updated_at 
  BEFORE UPDATE ON landing_pages 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();