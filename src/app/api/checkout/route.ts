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
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const slug = typeof body.slug === "string" ? body.slug.trim() : "";
    const plan = normalizeCheckoutPlan(body.plan);
    const billingCycle = normalizeBillingCycle(body.billingCycle ?? body.billing_cycle);
    const planCopy = getCheckoutPlanCopy(plan);
    const priceCopy = getAiReadyPriceCopy(billingCycle);

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "slug is required" },
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

    const siteUrl = process.env.SITE_URL || "https://schemapage.io";
    const credentialsAiDomain =
      process.env.CREDENTIALS_AI_DOMAIN || "https://credentialsai.com.au";

    // AI-Ready Business Page checkouts now thread the customer
    // straight into the Credentials AI /welcome flow so they land on a real
    // dashboard instead of the SchemaPage builder page. Legacy `pro` checkouts
    // keep the old success/cancel URLs.
    const successUrl =
      plan === "verified_lead_engine"
        ? `${credentialsAiDomain}/welcome?session_id={CHECKOUT_SESSION_ID}`
        : `${siteUrl}/${page.slug}?checkout=success&plan=${planCopy.successPlan}`;
    const cancelUrl =
      plan === "verified_lead_engine"
        ? `${credentialsAiDomain}/pricing?checkout=cancelled`
        : `${siteUrl}/${page.slug}?checkout=cancelled&plan=${planCopy.successPlan}`;

    let lineItem: Stripe.Checkout.SessionCreateParams.LineItem;

    if (plan === "verified_lead_engine") {
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

      lineItem = {
        price: priceId,
        quantity: 1,
      };
    } else {
      lineItem = {
        price_data: {
          currency: "aud",
          recurring: {
            interval: "month",
          },
          product_data: {
            name: planCopy.name,
            description: `${planCopy.description} for ${page.business_name}`,
          },
          unit_amount: planCopy.amount,
        },
        quantity: 1,
      };
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [lineItem],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        slug: page.slug,
        plan,
        billing_cycle: plan === "verified_lead_engine" ? billingCycle : "monthly",
        price_label: plan === "verified_lead_engine" ? priceCopy.priceLabel : planCopy.priceLabel,
        source: "schemapage_checkout",
        product: "credentials_ai",
        business_name: page.business_name,
      },
      subscription_data: {
        metadata: {
          slug: page.slug,
          plan,
          billing_cycle: plan === "verified_lead_engine" ? billingCycle : "monthly",
          price_label: plan === "verified_lead_engine" ? priceCopy.priceLabel : planCopy.priceLabel,
          product: "credentials_ai",
          business_name: page.business_name,
        },
      },
      // Pre-fill the customer's email if we already know it. Stripe still
      // lets them change it during checkout.
      ...(page.creator_email
        ? { customer_email: page.creator_email }
        : page.contact_email
          ? { customer_email: page.contact_email }
          : {}),
    });

    if (!session.url) {
      return NextResponse.json(
        { success: false, error: "Failed to create checkout session" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, url: session.url });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}
