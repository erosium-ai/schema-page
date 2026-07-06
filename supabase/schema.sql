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
  is_pro BOOLEAN NOT NULL DEFAULT FALSE,
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

-- Grants for Supabase roles (auto-applied on new projects; rerun if missing)
GRANT SELECT ON public.pages TO anon;
GRANT ALL ON public.pages TO service_role;

-- === 2026-07-06 Pro tier + rate limit ===

-- Rate-limit bookkeeping table. Used by /api/page for IP-based rate limiting.
-- IP addresses are stored SHA-256 hashed (never raw IPs) for privacy.
CREATE TABLE IF NOT EXISTS page_creations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash text NOT NULL,
  slug text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Fast lookup for recent creations by hashed IP.
CREATE INDEX IF NOT EXISTS idx_page_creations_ip_created ON page_creations(ip_hash, created_at DESC);

-- page_creations is admin-only; anon/authenticated users do not need access.
GRANT ALL ON page_creations TO service_role;

COMMENT ON TABLE page_creations IS 'used by /api/page for IP-based rate limiting';
