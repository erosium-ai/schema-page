import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/supabase";
import PageShell from "@/components/PageShell";
import JsonLdDownload from "@/components/JsonLdDownload";

// CRITICAL: Force dynamic rendering for all [slug] pages to prevent
// stale prerendered 404s on Railway edge cache when profiles are added
// after initial deployment. Do NOT set dynamicParams=false.
// Build: redeploy 2026-07-28 13:50 AEST
export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

interface Props {
  params: Promise<{ slug: string }>;
}

const siteUrl = process.env.SITE_URL || "https://credentialsai.com.au";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) return { title: "Not Found — Credentials AI" };

  return {
    title: `${page.business_name} — Credentials AI`,
    description: page.tagline || page.description || "AI-readable business page",
    openGraph: {
      title: `${page.business_name} — Credentials AI`,
      description: page.tagline || page.description || "AI-readable business page",
      url: `${siteUrl}/${page.slug}`,
      type: "website",
    },
  };
}

export default async function PublicPage({ params }: Props) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) return notFound();

  return (
    <PageShell page={page} downloadSection={<JsonLdDownload page={page} />} />
  );
}
