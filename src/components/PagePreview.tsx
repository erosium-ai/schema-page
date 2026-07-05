import { PageData } from "@/lib/types";
import { generateSchemaMarkup } from "@/lib/schema-generator";

interface PagePreviewProps {
  page: PageData;
}

export default function PagePreview({ page }: PagePreviewProps) {
  const schema = generateSchemaMarkup(page);

  return (
    <div className="border rounded-xl p-6 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">{page.business_name}</h2>
        <span className="inline-flex items-center gap-1 text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">
          AI-Agent Friendly
        </span>
      </div>

      {page.tagline && <p className="text-gray-600 italic mb-4">{page.tagline}</p>}
      {page.description && <p className="text-gray-700 mb-4">{page.description}</p>}

      {page.services && page.services.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-500 mb-2">Services</h3>
          <ul className="space-y-1">
            {page.services.map((s, i) => (
              <li key={i} className="text-sm">
                <span className="font-medium">{s.name}</span>
                {s.price && <span className="text-gray-600"> — {s.price}</span>}
                {s.description && <span className="text-gray-600"> — {s.description}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-4">
        <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-500 mb-2">Contact</h3>
        <div className="text-sm space-y-1">
          {page.contact_email && <p>📧 {page.contact_email}</p>}
          {page.contact_phone && <p>📞 {page.contact_phone}</p>}
          {page.website_url && <p>🌐 {page.website_url}</p>}
          {page.location_address && <p>📍 {page.location_address}</p>}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-xs font-semibold text-gray-500 mb-1">Machine-Readable Preview</p>
        <pre className="text-xs text-gray-700 whitespace-pre-wrap overflow-auto max-h-40">
          {schema.plainText.slice(0, 600)}
          {schema.plainText.length > 600 ? "..." : ""}
        </pre>
      </div>
    </div>
  );
}
