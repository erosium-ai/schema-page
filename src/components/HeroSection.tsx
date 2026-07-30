"use client";

// 🔑 Keywords: schema-page builder hero, intent-aware hero, free vs paid intent, upgrade CTA in free mode, no CTA in paid mode, cyan emerald palette align with credentialsai homepage, $12.90/week price anchor, Create my AI-Ready Business Page

import { ArrowRight, Search, Shield, Zap } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

/** Label of the form submit button in paid mode — referenced in hero copy so
 *  the instruction and the actual button always match. Keep in sync with
 *  BuilderForm.tsx PAID_SUBMIT_LABEL. */
const PAID_SUBMIT_LABEL = "Create my AI-Ready Business Page";

const PREMIUM_INCLUDES = [
  "Full AI-Ready Business Page",
  "ABN-backed TrustBadge",
  "Tracked calls, quotes & sources",
  "QR code for magnets, flyers, invoices & vehicles",
  "Weekly enquiry summary",
];

function HeroContent() {
  const params = useSearchParams();
  const intent = params?.get("intent") || "free";

  const isPaid = intent === "paid" || intent === "verified_lead_engine";

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 text-white">
      {/* Soft cyan/emerald wash so this page reads as the same product as the
          credentialsai.com.au homepage the visitor just came from. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 55% 60% at 18% 12%, rgb(34 211 238 / 0.16), transparent 70%), radial-gradient(ellipse 55% 65% at 82% 20%, rgb(16 185 129 / 0.18), transparent 70%)",
        }}
      />
      <div className="relative max-w-4xl mx-auto px-4 py-16 md:py-20">
        <div className="text-center">
          <p className="text-sm font-semibold tracking-widest uppercase mb-3 text-cyan-300">
            For your existing business. Your new business. Your side hustle.
          </p>
          <p className="mb-5 text-sm font-semibold text-slate-300 md:text-base">
            Every business needs verification and AI readability.
          </p>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            {isPaid ? (
              <>
                Professional online presence.
                <br />
                <span className="text-emerald-300">$12.90/week.</span>
              </>
            ) : (
              <>
                Professional online presence.
                <br />
                <span className="text-emerald-300">Start free — or unlock the full toolkit for $12.90/week.</span>
              </>
            )}
          </h1>

          <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            {isPaid
              ? "Get found on Google & AI, show verified trust, track every lead — all for less than your daily coffee."
              : "Give people something real to find when they search for you — on Google, in AI, wherever your next customer is looking. A proper page, verified details, and a way to reach you — start free, cancel anytime."}
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-800/80 px-4 py-2 text-sm font-medium backdrop-blur">
              <Search className="w-4 h-4 text-cyan-300" /> Found on Google &amp; AI
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-800/80 px-4 py-2 text-sm font-medium backdrop-blur">
              <Shield className="w-4 h-4 text-emerald-300" /> Verified trust
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-800/80 px-4 py-2 text-sm font-medium backdrop-blur">
              <Zap className="w-4 h-4 text-cyan-300" /> 15 minute setup
            </span>
          </div>

          {isPaid ? (
            /* ── PAID MODE ────────────────────────────────────────────────────
               They already chose the paid plan on the homepage. Do not re-sell
               it and do not offer another button — just confirm what they're
               getting and point at the form. */
            <div className="mx-auto max-w-2xl rounded-2xl border border-emerald-400/30 bg-emerald-400/5 px-6 py-6 text-left shadow-xl shadow-emerald-500/5">
              <p className="text-center text-sm font-extrabold uppercase tracking-widest text-emerald-300">
                Your AI-Ready Business Page
              </p>
              <div className="mt-4 grid gap-2.5 text-sm leading-relaxed sm:grid-cols-2">
                {PREMIUM_INCLUDES.map((item) => (
                  <p key={item} className="flex items-start gap-2 text-slate-200">
                    <span className="mt-0.5 font-bold text-emerald-300">✓</span>
                    <span>{item}</span>
                  </p>
                ))}
              </div>
              <p className="mt-5 border-t border-white/10 pt-4 text-center text-base font-semibold text-white">
                Fill in the form below and press{" "}
                <span className="text-emerald-300">&ldquo;{PAID_SUBMIT_LABEL}&rdquo;</span>.
              </p>
              <p className="mt-2 text-center text-sm text-slate-400">
                Takes about 15 minutes. $12.90/week, cancel anytime. Built on the Gold Coast 🇦🇺
              </p>
            </div>
          ) : (
            /* ── FREE MODE ────────────────────────────────────────────────────
               They're already on the free path, so the free option needs no
               button — the form is right below. The only button worth having
               here is the one that switches them up to premium. */
            <>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="/?intent=verified_lead_engine"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 px-8 py-4 text-lg font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5 hover:from-emerald-300 hover:via-teal-200 hover:to-cyan-200"
                >
                  Get Premium — $12.90/week <ArrowRight className="w-5 h-5" />
                </a>
              </div>
              <p className="mt-5 text-base font-semibold text-white">
                For free, just fill out the form below.
              </p>
              <p className="mt-2 text-sm text-slate-400">
                No credit card. No lock-in. Built on the Gold Coast 🇦🇺
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default function HeroSection() {
  return (
    <Suspense
      fallback={
        <section className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 text-white">
          <div className="max-w-4xl mx-auto px-4 py-16 md:py-20 text-center">
            <p className="text-lg text-slate-300">Loading...</p>
          </div>
        </section>
      }
    >
      <HeroContent />
    </Suspense>
  );
}
