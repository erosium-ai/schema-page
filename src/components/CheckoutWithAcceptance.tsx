"use client";

import { useState, type ReactNode } from "react";
import StartProCheckoutButton from "@/components/StartProCheckoutButton";
import type { LegalPolicyVersions } from "@/lib/legal-policy";

interface CheckoutWithAcceptanceProps {
  slug: string;
  policyVersions: LegalPolicyVersions;
}

const LEGAL_LINKS = {
  terms: "https://credentialsai.com.au/terms",
  privacy: "https://credentialsai.com.au/privacy",
  refunds: "https://credentialsai.com.au/refunds",
};

export default function CheckoutWithAcceptance({
  slug,
  policyVersions,
}: CheckoutWithAcceptanceProps) {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <PlanCard
          label="Best value"
          title="Monthly"
          price="A$49"
          suffix="/month"
          note="The clean default if you're ready to use it properly."
          button={
            <StartProCheckoutButton
              slug={slug}
              plan="verified_lead_engine"
              billingCycle="monthly"
              label="Continue with A$49/month"
              accepted={accepted}
              requireAcceptance
              policyVersions={policyVersions}
            />
          }
        />
        <PlanCard
          label="Lower upfront"
          title="Weekly"
          price="A$12.90"
          suffix="/week"
          note="Same page, same setup, easier weekly cashflow."
          button={
            <StartProCheckoutButton
              slug={slug}
              plan="verified_lead_engine"
              billingCycle="weekly"
              label="Continue with A$12.90/week"
              variant="secondary"
              accepted={accepted}
              requireAcceptance
              policyVersions={policyVersions}
            />
          }
        />
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-slate-200">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(event) => setAccepted(event.target.checked)}
          className="mt-1 h-4 w-4 rounded border-slate-500 bg-slate-950 text-cyan-400 focus:ring-cyan-300"
        />
        <span>
          I am authorised to act for this business and agree to the{" "}
          <a
            href={LEGAL_LINKS.terms}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-cyan-200 underline-offset-4 hover:underline"
          >
            Credentials AI Terms of Service
          </a>
          . I acknowledge the{" "}
          <a
            href={LEGAL_LINKS.privacy}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-cyan-200 underline-offset-4 hover:underline"
          >
            Privacy Policy
          </a>{" "}
          and{" "}
          <a
            href={LEGAL_LINKS.refunds}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-cyan-200 underline-offset-4 hover:underline"
          >
            Refund &amp; Cancellation Policy
          </a>
          .
        </span>
      </label>

      <p className="rounded-2xl border border-cyan-300/15 bg-cyan-300/8 px-4 py-3 text-sm leading-6 text-cyan-50">
        Secure recurring subscription payment is processed by Stripe. No card
        details are stored by Credentials AI. Prices are shown in Australian
        dollars; any GST treatment is shown by Stripe or on the applicable tax
        invoice where required.
      </p>
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
