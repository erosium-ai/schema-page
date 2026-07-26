"use client";

// 🔑 Keywords: schema-page builder intro, intent-aware builder heading, free vs paid copy, AI Business Card vs AI-Ready Business Page, cyan emerald palette

import { useSearchParams } from "next/navigation";

export default function BuilderIntro() {
  const params = useSearchParams();
  const raw = params?.get("intent");
  const isPaid =
    raw === "verified_lead_engine" ||
    raw === "founding" ||
    raw === "founder_bundle" ||
    raw === "paid" ||
    raw === "pro";

  if (isPaid) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Set up your AI-Ready Business Page</h2>
        <p className="text-gray-600">
          Fill in the details below. We&apos;ll build your AI-Ready Business Page with structured Schema.org markup,
          an ABN-backed TrustBadge, and tracked calls, quote requests and source reporting.
        </p>
        <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-950">
          $12.90/week, or $49/month if you prefer. Same product. Cancel anytime.
          <span className="block mt-1 font-semibold">
            Built to help customers find you, trust you, enquire, and let you see what came through.
          </span>
        </p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-2">Start your free AI Business Card</h2>
      <p className="text-gray-600">
        Fill in the details below. We&apos;ll generate a clean AI Business Card with structured Schema.org markup,
        then you can upgrade it into an AI-Ready Business Page with tracked calls, quote requests, and proof reporting.
      </p>
      <p className="mt-3 rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-medium text-cyan-950">
        AI-Ready Business Page: $12.90/week, or $49/month. Same product. Choose weekly or monthly. Cancel anytime.
        <span className="block mt-1 font-semibold">
          Built to help customers find you, trust you, enquire, and let you see what came through.
        </span>
      </p>
    </div>
  );
}
