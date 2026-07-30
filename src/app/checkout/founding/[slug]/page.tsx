/* 🔑 Keywords: Credentials AI checkout page, AI-Ready Business Page, A$49 monthly, A$12.90 weekly, Stripe checkout, legal acceptance */

import Link from "next/link";
import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/subscription";
import { LEGAL_POLICY_VERSIONS } from "@/lib/legal-policy";
import CheckoutWithAcceptance from "@/components/CheckoutWithAcceptance";

interface Props {
  params: Promise<{ slug: string }>;
}

const AI_READY_BENEFITS = [
  "AI-ready business page customers can call, email, or request quotes from",
  "Conservative business-detail trust wording based on the recorded ABR/ABN check, source and date",
  "Service, suburb, FAQ, and contact structure built for customers and AI systems",
  "Tracked calls, email clicks, quote requests, and source attribution",
  "Instant lead alerts to the business owner",
  "Lead status tracking from new to contacted, quoted, won, lost, or spam",
  "Weekly proof summary and CSV export",
];

export default async function FoundingCheckoutPage({ params }: Props) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-[#03111f] text-white">
      <main className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
        <div className="overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-slate-950/80 shadow-2xl shadow-cyan-950/40 backdrop-blur">
          <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.22),transparent_34%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.18),transparent_30%)] px-6 py-7 sm:px-8 sm:py-9">
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-cyan-200">
              AI-Ready Business Page
            </p>
            <h1 className="mt-3 max-w-2xl text-3xl font-black tracking-tight text-white sm:text-5xl">
              Choose how you want to pay.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              You&apos;re setting up Credentials AI for{" "}
              <span className="font-semibold text-cyan-100">{page.business_name}</span>.
              Same product. Choose weekly or monthly. Cancel future renewals anytime.
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-cyan-100/90 sm:text-base">
              Once payment is complete, we&rsquo;ll open your dashboard automatically.
              This can take around 10 seconds.
            </p>
          </div>

          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.08fr_0.92fr]">
            <section className="space-y-4">
              <CheckoutWithAcceptance
                slug={page.slug}
                policyVersions={LEGAL_POLICY_VERSIONS}
              />
            </section>

            <aside className="rounded-3xl border border-emerald-300/20 bg-emerald-300/8 p-5">
              <p className="text-sm font-extrabold text-emerald-100">
                What your AI-Ready Business Page includes
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-200">
                {AI_READY_BENEFITS.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2">
                    <span className="mt-0.5 text-emerald-300">✓</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/55 p-4 text-xs leading-6 text-slate-400">
                Business-detail trust wording is limited to the specific check,
                source and date shown on the profile. It is not a licence,
                insurance, quality, safety or general-compliance guarantee.
              </div>
            </aside>
          </div>

          <div className="border-t border-white/10 px-6 py-5 sm:px-8">
            <Link
              href={`/${page.slug}`}
              className="text-sm font-semibold text-slate-300 underline-offset-4 hover:text-cyan-200 hover:underline"
            >
              Back to my page
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
