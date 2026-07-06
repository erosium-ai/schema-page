-- === 2026-07-06 Pro tier + rate limit ===
-- Adds is_pro flag for Pro users and page_creations table for IP-based rate limiting.

-- Pro flag: removes SchemaPage branding when true.
ALTER TABLE pages ADD COLUMN IF NOT EXISTS is_pro BOOLEAN NOT NULL DEFAULT FALSE;

-- Rate-limit bookkeeping table. Used by /api/page for IP-based rate limiting.
-- IP addresses are stored SHA-256 hashed (never raw IPs) for privacy.
create table if not exists page_creations (
  id uuid primary key default gen_random_uuid(),
  ip_hash text not null,
  slug text not null,
  created_at timestamptz not null default now()
);

-- Fast lookup for recent creations by hashed IP.
create index if not exists idx_page_creations_ip_created on page_creations(ip_hash, created_at desc);

-- page_creations is admin-only; anon/authenticated users do not need access.
GRANT ALL ON page_creations TO service_role;

comment on table page_creations is 'used by /api/page for IP-based rate limiting';
