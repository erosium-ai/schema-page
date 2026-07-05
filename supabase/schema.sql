-- SchemaPage MVP database schema
-- Apply via Supabase SQL Editor or migrations

CREATE TABLE IF NOT EXISTS pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  business_name text NOT NULL,
  tagline text,
  description text,
  services jsonb DEFAULT '[]'::jsonb,
  contact_email text,
  contact_phone text,
  website_url text,
  location_address text,
  social_links jsonb DEFAULT '{}'::jsonb,
  brand_color text DEFAULT '#22c55e',
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- Allow public read on all pages (public landing pages)
CREATE POLICY "Pages are publicly readable"
  ON pages FOR SELECT
  USING (true);

-- Allow insert without auth for MVP (open builder)
-- In production, gate this behind auth or rate limits
CREATE POLICY "Anyone can create a page"
  ON pages FOR INSERT
  WITH CHECK (true);

-- Update/Delete only by matching service_role or future owner logic
CREATE POLICY "Only service role can update pages"
  ON pages FOR UPDATE
  USING (false)
  WITH CHECK (false);

CREATE POLICY "Only service role can delete pages"
  ON pages FOR DELETE
  USING (false);

-- Index on slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
