import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/supabase";
import { generateSchemaMarkup } from "@/lib/schema-generator";
import SchemaBadge from "@/components/SchemaBadge";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) return { title: "Not Found — SchemaPage" };

  return {
    title: `${page.business_name} — SchemaPage`,
    description: page.tagline || page.description || "AI-Agent readable business page",
  };
}

export default async function PublicPage({ params }: Props) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) return notFound();

  const schema = generateSchemaMarkup(page);

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema.ldJson) }}
      />

      <header className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">SchemaPage Business Card</span>
          </div>
          <SchemaBadge />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-sm border p-8 md:p-12">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">{page.business_name}</h1>
            {page.tagline && (
              <p className="text-xl text-gray-600 italic">{page.tagline}</p>
            )}
          </div>

          {page.description && (
            <p className="text-gray-700 text-lg mb-8">{page.description}</p>
          )}

          {page.services && page.services.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold mb-4 text-gray-900">Services</h2>
              <div className="space-y-4">
                {page.services.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-start justify-between rounded-lg border p-4"
                  >
                    <div>
                      <p className="font-semibold">{s.name}</p>
                      {s.description && <p className="text-sm text-gray-600">{s.description}</p>}
                    </div>
                    {s.price && (
                      <span className="text-sm font-bold text-brand-600 badge whitespace-nowrap">
                        {s.price}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="mb-8">
            <h2 className="text-lg font-bold mb-4 text-gray-900">Contact</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {page.contact_email && (
                <a
                  href={`mailto:${page.contact_email}`}
                  className="flex items-center gap-2 text-brand-600 hover:underline"
                >
                  📧 {page.contact_email}
                </a>
              )}
              {page.contact_phone && (
                <a
                  href={`tel:${page.contact_phone}`}
                  className="flex items-center gap-2 text-brand-600 hover:underline"
                >
                  📞 {page.contact_phone}
                </a>
              )}
              {page.website_url && (
                <a
                  href={page.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-brand-600 hover:underline"
                >
                  🌐 {page.website_url.replace(/^https?:\/\//, "")}
                </a>
              )}
              {page.location_address && (
                <p className="flex items-center gap-2 text-gray-700">📍 {page.location_address}</p>
              )}
            </div>
          </section>

          <div className="rounded-xl border border-dashed p-6 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">AI-Agent Readable Export</h3>
            <p className="text-xs text-gray-600 mb-3">
              Copy the structured data below to feed this business into any AI system.
            </p>
            <details>
              <summary className="cursor-pointer text-xs font-semibold text-brand-600">
                Show JSON-LD
              </summary>
              <pre className="mt-2 text-xs bg-white border rounded-lg p-3 overflow-auto max-h-64">
                {JSON.stringify(schema.ldJson, null, 2)}
              </pre>
            </details>
            <details className="mt-2">
              <summary className="cursor-pointer text-xs font-semibold text-brand-600">
                Show Markdown
              </summary>
              <pre className="mt-2 text-xs bg-white border rounded-lg p-3 overflow-auto max-h-64 whitespace-pre-wrap">
                {schema.markdown}
              </pre>
            </details>
          </div>
        </div>
      </main>

      <footer className="border-t bg-white">
        <div className="max-w-3xl mx-auto px-4 py-6 text-center text-xs text-gray-500">
          Built with{" "}
          <a href="/" className="text-brand-600 hover:underline">SchemaPage</a> — AI-Agent
          readable business pages.
        </div>
      </footer>
    </div>
  );
}
