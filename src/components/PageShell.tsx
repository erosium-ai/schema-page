import { Suspense } from "react";
import { PageData } from "@/lib/types";
import { generateSchemaMarkup } from "@/lib/schema-generator";
import SchemaBadge from "@/components/SchemaBadge";
import UpgradeButton from "@/components/UpgradeButton";
import CheckoutStatusBanner from "@/components/CheckoutStatusBanner";
import { isDemoAllowlistEnabled } from "@/lib/founder";
import DemoBanner from "@/components/DemoBanner";
import { JSX } from "react";
import { Sparkles } from "lucide-react";

export default function PageShell({
  page,
  downloadSection,
}: {
  page: PageData;
  downloadSection?: React.ReactNode | JSX.Element;
}) {
  const schema = generateSchemaMarkup(page);
  const showDemoBanner = isDemoAllowlistEnabled();
  const isPro = !!page.is_pro;
  const description = page.description?.trim() || "";
  const hasContact = Boolean(
    page.contact_email || page.contact_phone || page.website_url || page.location_address
  );

  const summaryParts: string[] = [];
  if (page.tagline) summaryParts.push(page.tagline);
  if (page.location_address) summaryParts.push(`Located at ${page.location_address}.`);
  if (page.services && page.services.length > 0) {
    summaryParts.push(`Offers ${page.services.length} service${page.services.length > 1 ? "s" : ""}.`);
  }
  if (page.contact_email || page.contact_phone) {
    summaryParts.push("Contact details are listed below.");
  }
  const quickSummary =
    summaryParts.join(" ") ||
    `${page.business_name} now has a live business page. Add more details when you're ready to make it even clearer for customers.`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={null}>
        <CheckoutStatusBanner />
      </Suspense>

      {showDemoBanner && <DemoBanner />}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema.ldJson) }}
      />

      <header className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              SchemaPage Business Card
            </span>
          </div>
          {isPro ? (
            <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-sm font-bold px-3 py-1.5 rounded-full">
              <Sparkles className="h-4 w-4" />
              PRO
            </span>
          ) : (
            <SchemaBadge />
          )}
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

          <section className="mb-8 rounded-xl border bg-gray-50 p-5">
            <h2 className="text-lg font-bold mb-2 text-gray-900">What your customers will see</h2>
            <p className="text-gray-700">{quickSummary}</p>
          </section>

          {description && (
            <section className="mb-8">
              <h2 className="text-lg font-bold mb-3 text-gray-900">Description</h2>
              <details className="rounded-lg border bg-gray-50 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-brand-600">
                  View description
                </summary>
                <p className="text-gray-700 text-base mt-3 whitespace-pre-wrap">
                  {description}
                </p>
              </details>
            </section>
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
                      {s.description && (
                        s.description.length > 120 ? (
                          <details className="mt-1">
                            <summary className="cursor-pointer text-xs font-semibold text-brand-600">
                              View description
                            </summary>
                            <p className="text-sm text-gray-600 mt-1">{s.description}</p>
                          </details>
                        ) : (
                          <p className="text-sm text-gray-600">{s.description}</p>
                        )
                      )}
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
            {hasContact ? (
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
                  <p className="flex items-center gap-2 text-gray-700">
                    📍 {page.location_address}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-600 rounded-lg border bg-gray-50 p-3">
                No contact details added yet.
              </p>
            )}
          </section>

          <details className="rounded-xl border border-dashed p-6 bg-gray-50">
            <summary className="cursor-pointer text-sm font-semibold text-gray-700">
              Advanced (optional): AI export tools
            </summary>
            <p className="text-xs text-gray-600 mt-2 mb-3">
              Most people can ignore this. Open only if you want to copy technical data for AI tools.
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

            {downloadSection}
          </details>
        </div>

        {!isPro && (
          <div className="mt-8 bg-white rounded-2xl shadow-sm border p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 text-brand-600 font-semibold text-sm">
                  <Sparkles className="h-4 w-4" />
                  SchemaPage Pro
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900">
                  Unlock SchemaPage Pro
                </h2>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-brand-600 mt-0.5">✓</span>
                    Remove SchemaPage branding
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-600 mt-0.5">✓</span>
                    Upgrade this page to Pro
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-600 mt-0.5">✓</span>
                    Priority support
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-600 mt-0.5">✓</span>
                    All future Pro features
                  </li>
                </ul>
                <p className="text-lg font-semibold text-gray-900">
                  $29 AUD <span className="text-sm font-normal text-gray-500">— one-time payment</span>
                </p>
              </div>
              <div className="shrink-0">
                <UpgradeButton slug={page.slug} />
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t bg-white">
        <div className="max-w-3xl mx-auto px-4 py-6 text-center text-xs text-gray-500">
          Built with{" "}
          <a href="/" className="text-brand-600 hover:underline">
            SchemaPage
          </a>{" "}
          — AI-Agent readable business pages.
        </div>
      </footer>
    </div>
  );
}
