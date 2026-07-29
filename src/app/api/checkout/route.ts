import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getPageBySlug } from "@/lib/subscription";
import {
  FOUNDING_MEMBER_LOOKUP_KEY,
  getAiReadyPriceCopy,
  getCheckoutPlanCopy,
  normalizeBillingCycle,
  normalizeCheckoutPlan,
} from "@/lib/checkout-plans";
import {
  isCurrentLegalPolicyVersions,
} from "@/lib/legal-policy";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const slug = typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";
    const plan = normalizeCheckoutPlan(body.plan);
    const billingCycle = normalizeBillingCycle(body.billingCycle ?? body.billing_cycle);

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "slug is required" },
        { status: 400 }
      );
    }

    if (!plan) {
      return NextResponse.json(
        { success: false, error: "Unknown or unsupported checkout plan" },
        { status: 400 }
      );
    }

    if (!billingCycle) {
      return NextResponse.json(
        { success: false, error: "billingCycle must be monthly or weekly" },
        { status: 400 }
      );
    }

    if (body.accepted !== true || !isCurrentLegalPolicyVersions(body.policyVersions)) {
      return NextResponse.json(
        {
          success: false,
          error: "Current Terms, Privacy and Refund & Cancellation Policy acceptance is required",
        },
        { status: 400 }
      );
    }

    const page = await getPageBySlug(slug);
    if (!page) {
      return NextResponse.json(
        { success: false, error: "Page not found" },
        { status: 404 }
      );
    }

    const credentialsAiDomain =
      process.env.CREDENTIALS_AI_DOMAIN || "https://credentialsai.com.au";
    const planCopy = getCheckoutPlanCopy(plan);
    const priceCopy = getAiReadyPriceCopy(billingCycle);
    const legalAcceptedAt = new Date().toISOString();

    const configuredPriceId =
      process.env[priceCopy.envKey] ||
      (billingCycle === "monthly" ? process.env.STRIPE_FOUNDING_MEMBER_PRICE_ID : undefined);
    let priceId = configuredPriceId?.trim();

    if (!priceId) {
      const prices = await stripe.prices.list({
        lookup_keys:
          billingCycle === "monthly"
            ? [priceCopy.lookupKey, FOUNDING_MEMBER_LOOKUP_KEY]
            : [priceCopy.lookupKey],
        active: true,
        limit: 1,
      });
      priceId = prices.data[0]?.id;
    }

    if (!priceId) {
      return NextResponse.json(
        {
          success: false,
          error:
            billingCycle === "weekly"
              ? "Weekly Stripe price is not configured"
              : "Monthly Stripe price is not configured",
        },
        { status: 500 }
      );
    }

    const legalMetadata = {
      legal_accepted_at: legalAcceptedAt,
      terms_version: body.policyVersions.terms,
      privacy_version: body.policyVersions.privacy,
      refunds_version: body.policyVersions.refunds,
    };

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${credentialsAiDomain}/welcome?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${credentialsAiDomain}/pricing?checkout=cancelled`,
      ...(page.creator_email
        ? { customer_email: page.creator_email }
        : page.contact_email
          ? { customer_email: page.contact_email }
          : {}),
      metadata: {
        slug: page.slug,
        plan,
        billing_cycle: billingCycle,
        price_label: priceCopy.priceLabel,
        source: "schemapage_checkout",
        product: "credentials_ai",
        business_name: page.business_name,
        ...legalMetadata,
      },
      subscription_data: {
        metadata: {
          slug: page.slug,
          plan,
          billing_cycle: billingCycle,
          price_label: priceCopy.priceLabel,
          product: "credentials_ai",
          business_name: page.business_name,
          ...legalMetadata,
        },
      },
    });

    return NextResponse.json({ success: true, url: session.url });
  } catch (error) {
    console.error("checkout_session_failed", error);
    return NextResponse.json(
      { success: false, error: "Unable to start checkout" },
      { status: 500 }
    );
  }
}
