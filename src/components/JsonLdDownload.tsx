"use client";

import { useState } from "react";
import { Download, Copy, Check } from "lucide-react";
import { PageData } from "@/lib/types";
import { generateSchemaMarkup } from "@/lib/schema-generator";

export default function JsonLdDownload({ page }: { page: PageData }) {
  const [copied, setCopied] = useState(false);
  const [show, setShow] = useState(false);
  const schema = generateSchemaMarkup(page);
  const jsonText = JSON.stringify(schema.ldJson, null, 2);

  const handleDownload = () => {
    const blob = new Blob([jsonText], { type: "application/ld+json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${page.slug}-schema.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-8 rounded-xl border p-6 bg-white">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">JSON-LD Download</h3>
          <p className="text-xs text-gray-600">
            Download or copy the structured Schema.org JSON-LD for this page.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition"
          >
            <Download className="h-4 w-4" />
            Download
          </button>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      <button
        onClick={() => setShow((s) => !s)}
        className="text-xs font-semibold text-brand-600 hover:underline"
      >
        {show ? "Hide JSON-LD" : "Preview JSON-LD"}
      </button>

      {show && (
        <pre className="mt-3 text-xs bg-gray-50 border rounded-lg p-3 overflow-auto max-h-64">
          {jsonText}
        </pre>
      )}
    </div>
  );
}
