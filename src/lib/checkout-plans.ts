/* 🔑 Keywords: Stripe checkout plans, Credentials AI, AI-Ready Business Page, weekly monthly billing */

export type CheckoutPlan = "pro" | "verified_lead_engine";
export type BillingCycle = "monthly" | "weekly";

export const FOUNDING_MEMBER_LOOKUP_KEY = "credentials_ai_founder_49_aud_monthly";
export const AI_READY_MONTHLY_LOOKUP_KEY = "credentials_ai_ready_business_page_49_aud_monthly";
export const AI_READY_WEEKLY_LOOKUP_KEY = "credentials_ai_ready_business_page_1290_aud_weekly";

export function normalizeCheckoutPlan(value: unknown): CheckoutPlan {
  if (value === "verified_lead_engine" || value === "founding" || value === "founder_bundle") {
    return "verified_lead_engine";
  }

  return "pro";
}

export function normalizeBillingCycle(value: unknown): BillingCycle {
  return value === "weekly" ? "weekly" : "monthly";
}

export function getAiReadyPriceCopy(cycle: BillingCycle) {
  if (cycle === "weekly") {
    return {
      billingCycle: cycle,
      priceLabel: "$12.90/week",
      amount: 1290,
      interval: "week" as const,
      lookupKey: AI_READY_WEEKLY_LOOKUP_KEY,
      envKey: "STRIPE_AI_READY_WEEKLY_PRICE_ID",
    };
  }

  return {
    billingCycle: cycle,
    priceLabel: "$49/month",
    amount: 4900,
    interval: "month" as const,
    lookupKey: AI_READY_MONTHLY_LOOKUP_KEY,
    envKey: "STRIPE_AI_READY_MONTHLY_PRICE_ID",
  };
}

export function getCheckoutPlanCopy(plan: CheckoutPlan) {
  if (plan === "verified_lead_engine") {
    return {
      name: "Credentials AI — AI-Ready Business Page",
      shortName: "AI-Ready Business Page",
      priceLabel: "$49/month or $12.90/week",
      amount: 4900,
      lookupKey: AI_READY_MONTHLY_LOOKUP_KEY,
      successPlan: "founding",
      description:
        "AI-ready business page, trust wording based on official Australian Business Register data, tracked enquiries, source attribution, and weekly proof summary."
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
