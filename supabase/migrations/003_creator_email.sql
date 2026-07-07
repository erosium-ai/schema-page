-- SchemaPage migration 003: Add creator email capture
-- Creator email is distinct from contact_email (the business email).
-- We need it for drip marketing / upsell follow-up to free users.

ALTER TABLE pages
ADD COLUMN IF NOT EXISTS creator_email text;

-- Index for future email lookup / drip campaign segmentation
CREATE INDEX IF NOT EXISTS idx_pages_creator_email ON pages(creator_email)
WHERE creator_email IS NOT NULL;

COMMENT ON COLUMN pages.creator_email IS 'Email of the person who created the page (for marketing follow-up)';
