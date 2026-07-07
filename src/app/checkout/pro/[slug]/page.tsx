import Link from "next/link";
import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/subscription";
import StartProCheckoutButton from "@/components/StartProCheckoutButton";

interface Props {
  params: Promise<{ slug: string }>;
}

const PRO_BENEFITS = [
  "Enhanced AI-readable business page",
  "Structured data built for ChatGPT, Gemini, Grok, Claude, and Google",
  "Service area + category optimisation",
  "FAQ section written for AI/search answers",
  "Click-to-call / website / social links",
  "Priority updates when they change business details",
  "QR-code-ready page link",
  "Basic conversion tracking",
];

export default async function ProCheckoutPage({ params }: Props) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
            Pro AI Presence checkout
          </p>
          <h1 className="mt-2 text-2xl font-extrabold text-gray-900 sm:text-3xl">
            You&apos;re upgrading to Pro AI Presence — $19/month
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            You&apos;re upgrading <span className="font-semibold text-gray-900">{page.business_name}</span>. Review what you get below, then continue to secure payment.
          </p>

          <ul className="mt-6 space-y-2 text-sm text-gray-700">
            {PRO_BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-start gap-2">
                <span className="mt-0.5 text-brand-600">✓</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <StartProCheckoutButton slug={page.slug} />
            <Link
              href={`/${page.slug}`}
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Back to my page
            </Link>
          </div>

          <p className="mt-5 text-xs text-gray-500">
            Secure payment is processed by Stripe. You can cancel before payment is completed.
          </p>
        </div>
      </main>
    </div>
  );
}

