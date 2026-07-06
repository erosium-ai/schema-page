import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/supabase";
import PageShell from "@/components/PageShell";
import JsonLdDownload from "@/components/JsonLdDownload";

interface Props {
  params: Promise<{ slug: string }>;
}

const siteUrl = process.env.SITE_URL || "https://schemapage.io";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) return { title: "Not Found — SchemaPage" };

  return {
    title: `${page.business_name} — SchemaPage`,
    description: page.tagline || page.description || "AI-Agent readable business page",
    openGraph: {
      title: `${page.business_name} — SchemaPage`,
      description: page.tagline || page.description || "AI-Agent readable business page",
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
