# SchemaPage

> AI-Agent Readable Business Pages — built for humans, discoverable by machines.

## What is it?

A dead-simple page generator where businesses fill in a form and get:

1. A beautiful human-readable landing page
2. Perfectly structured Schema.org JSON-LD (AI-agent friendly)
3. A machine-readable JSON/Markdown export endpoint
4. An "AI-Agent Friendly" embeddable badge

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Postgres)
- Railway (deploy)

## Quick Start

```bash
npm install
# Copy env and fill in your Supabase credentials
cp .env.example .env.local
npm run dev
```

## Supabase Setup

1. Create a new Supabase project (or use an existing one).
2. Run the schema in `supabase/schema.sql` via the SQL Editor or migrations.
3. Copy project URL + anon key into `.env.local`.

## Deploy to Railway

1. Push this repo to GitHub.
2. Create a Railway project, link the repo.
3. Add the environment variables from `.env.example` (use production Supabase values).
4. Railway auto-detects Next.js and deploys.

## Why This Wins

- FOMO narrative: "AI agents from ChatGPT, Claude, Gemini are searching for local businesses. Is yours readable?"
- Freemium natural: 1 page free, Pro for custom domains + analytics.
- Weekend build on existing Erosium stack.
