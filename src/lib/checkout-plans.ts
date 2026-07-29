/* 🔑 Keywords: Stripe checkout plans, Credentials AI, AI-Ready Business Page, weekly monthly billing, fail closed */

export type CheckoutPlan = "verified_lead_engine";
export type BillingCycle = "monthly" | "weekly";

export const FOUNDING_MEMBER_LOOKUP_KEY = "creden…thly";
export const AI_READY_MONTHLY_LOOKUP_KEY = "creden…thly";
export const AI_READY_WEEKLY_LOOKUP_KEY = "creden…ekly";

export function normalizeCheckoutPlan(value: unknown): CheckoutPlan | null {
  if (value === "verified_lead_engine" || value === "founding" || value === "founder_bundle") {
    return "verified_lead_engine";
  }

  return null;
}

export function normalizeBillingCycle(value: unknown): BillingCycle | null {
  if (value === "weekly") return "weekly";
  if (value === "monthly") return "monthly";
  return null;
}

export function getAiReadyPriceCopy(cycle: BillingCycle) {
  if (cycle === "weekly") {
    return {
      billingCycle: cycle,
      priceLabel: "A$12.90/week",
      amount: 1290,
      interval: "week" as const,
      lookupKey: AI_READY_WEEKLY_LOOKUP_KEY,
      envKey: "STRIPE_AI_READY_WEEKLY_PRICE_ID",
    };
  }

  return {
    billingCycle: cycle,
    priceLabel: "A$49/month",
    amount: 4900,
    interval: "month" as const,
    lookupKey: AI_READY_MONTHLY_LOOKUP_KEY,
    envKey: "STRIPE_AI_READY_MONTHLY_PRICE_ID",
  };
}

export function getCheckoutPlanCopy(_plan: CheckoutPlan) {
  return {
    name: "Credentials AI — AI-Ready Business Page",
    shortName: "AI-Ready Business Page",
    priceLabel: "A$49/month or A$12.90/week",
    amount: 4900,
    lookupKey: AI_READY_MONTHLY_LOOKUP_KEY,
    successPlan: "verified_lead_engine",
    description:
      "AI-ready business page, conservative ABR/ABN-based business-detail trust wording, tracked enquiries, source attribution, and weekly proof summary."
  };
}
