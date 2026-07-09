/* 🔑 Keywords: Stripe checkout plans, Credentials AI Founding 50, $49 AUD monthly, verified lead engine */

export type CheckoutPlan = "pro" | "verified_lead_engine";

export const FOUNDING_MEMBER_LOOKUP_KEY = "credentials_ai_founder_49_aud_monthly";

export function normalizeCheckoutPlan(value: unknown): CheckoutPlan {
  if (value === "verified_lead_engine" || value === "founding" || value === "founder_bundle") {
    return "verified_lead_engine";
  }

  return "pro";
}

export function getCheckoutPlanCopy(plan: CheckoutPlan) {
  if (plan === "verified_lead_engine") {
    return {
      name: "Credentials AI Founding Member — Verified Lead Engine",
      shortName: "Verified Lead Engine",
      priceLabel: "$49/month",
      amount: 4900,
      lookupKey: FOUNDING_MEMBER_LOOKUP_KEY,
      successPlan: "founding",
      description:
        "Founding 50 offer: verified business profile, TrustBadge verification, tracked enquiries, source attribution, weekly proof summary, and founder-assisted setup.",
    };
  }

  return {
    name: "Pro AI Presence",
    shortName: "Pro AI Presence",
    priceLabel: "$19/month",
    amount: 1900,
    lookupKey: null,
    successPlan: "pro",
    description: "Pro AI Presence subscription",
  };
}
