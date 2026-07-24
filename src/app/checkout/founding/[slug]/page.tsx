/* 🔑 Keywords: Credentials AI checkout page, AI-Ready Business Page, $49 monthly, $12.90 weekly, Stripe checkout */

import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { getPageBySlug } from "@/lib/subscription";
import StartProCheckoutButton from "@/components/StartProCheckoutButton";

interface Props {
  params: Promise<{ slug: string }>;
}

const AI_READY_BENEFITS = [
  "AI-ready business page customers can call, email, or request quotes from",
  "Trust wording based on official Australian Business Register data",
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
              Same product. Choose weekly or monthly. Cancel anytime.
            </p>
          </div>

          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.08fr_0.92fr]">
            <section className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <PlanCard
                  label="Best value"
                  title="Monthly"
                  price="$49"
                  suffix="/month"
                  note="The clean default if you&apos;re ready to use it properly."
                  button={
                    <StartProCheckoutButton
                      slug={page.slug}
                      plan="verified_lead_engine"
                      billingCycle="monthly"
                      label="Continue with $49/month"
                    />
                  }
                />
                <PlanCard
                  label="Lower upfront"
                  title="Weekly"
                  price="$12.90"
                  suffix="/week"
                  note="Same page, same setup, easier weekly cashflow."
                  button={
                    <StartProCheckoutButton
                      slug={page.slug}
                      plan="verified_lead_engine"
                      billingCycle="weekly"
                      label="Continue with $12.90/week"
                      variant="secondary"
                    />
                  }
                />
              </div>

              <p className="rounded-2xl border border-cyan-300/15 bg-cyan-300/8 px-4 py-3 text-sm leading-6 text-cyan-50">
                Secure subscription payment is processed by Stripe. No card details are stored by Credentials AI.
              </p>
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
                Business details are checked against official Australian Business Register data. We only show clear, conservative trust wording from that source.
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

function PlanCard({
  label,
  title,
  price,
  suffix,
  note,
  button,
}: {
  label: string;
  title: string;
  price: string;
  suffix: string;
  note: string;
  button: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-slate-950/30">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">{label}</p>
      <h2 className="mt-3 text-xl font-black text-white">{title}</h2>
      <p className="mt-3 flex items-end gap-1">
        <span className="text-4xl font-black tracking-tight text-white">{price}</span>
        <span className="pb-1 text-sm font-semibold text-slate-300">{suffix}</span>
      </p>
      <p className="mt-3 min-h-12 text-sm leading-6 text-slate-400">{note}</p>
      <div className="mt-5">{button}</div>
    </div>
  );
}
