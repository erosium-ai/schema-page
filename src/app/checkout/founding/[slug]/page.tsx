/* 🔑 Keywords: Founding 50 checkout page, $49 Stripe checkout, Credentials AI Verified Lead Engine */

import Link from "next/link";
import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/subscription";
import StartProCheckoutButton from "@/components/StartProCheckoutButton";

interface Props {
  params: Promise<{ slug: string }>;
}

const FOUNDER_BENEFITS = [
  "Everything in the free AI-readable profile",
  "Credentials AI lead profile customers can call, email, or request quotes from",
  "TrustBadge verification for up to 3 credentials",
  "Public verification page customers can click and check",
  "Tracked calls, email clicks, quote requests, and source attribution",
  "Instant lead alerts to the business owner",
  "Lead status tracking from new to contacted, quoted, won, lost, or spam",
  "Weekly proof summary and CSV export",
  "Founder-assisted setup with the $149 setup fee waived",
];

export default async function FoundingCheckoutPage({ params }: Props) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-2xl border border-orange-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">
            Founding 50 checkout
          </p>
          <h1 className="mt-2 text-2xl font-extrabold text-gray-900 sm:text-3xl">
            Verified Lead Engine — $49/month
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            You&apos;re claiming a Founding Member spot for{" "}
            <span className="font-semibold text-gray-900">{page.business_name}</span>. The normal $149 setup fee is
            waived for Founding Members.
          </p>

          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <p className="font-bold">First 50 businesses only.</p>
            <p className="mt-1">
              $49 AUD/month is locked while subscribed. After the Founding 50, standard pricing is planned at $99/mo +
              $149 setup.
            </p>
          </div>

          <ul className="mt-6 space-y-2 text-sm text-gray-700">
            {FOUNDER_BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-start gap-2">
                <span className="mt-0.5 text-orange-600">✓</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <StartProCheckoutButton
              slug={page.slug}
              plan="verified_lead_engine"
              label="Continue to secure $49/mo payment"
            />
            <Link
              href={`/${page.slug}`}
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Back to my page
            </Link>
          </div>

          <p className="mt-5 text-xs text-gray-500">
            Secure subscription payment is processed by Stripe. You can cancel before payment is completed.
          </p>
        </div>
      </main>
    </div>
  );
}
