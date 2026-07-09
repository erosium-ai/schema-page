import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getPageBySlug } from "@/lib/subscription";
import { getCheckoutPlanCopy, normalizeCheckoutPlan } from "@/lib/checkout-plans";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const slug = typeof body.slug === "string" ? body.slug.trim() : "";
    const plan = normalizeCheckoutPlan(body.plan);
    const planCopy = getCheckoutPlanCopy(plan);

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
    const successUrl = `${siteUrl}/${page.slug}?checkout=success&plan=${planCopy.successPlan}`;
    const cancelUrl = `${siteUrl}/${page.slug}?checkout=cancelled&plan=${planCopy.successPlan}`;

    let lineItem: Stripe.Checkout.SessionCreateParams.LineItem;

    if (plan === "verified_lead_engine") {
      const configuredPriceId = process.env.STRIPE_FOUNDING_MEMBER_PRICE_ID;
      let priceId = configuredPriceId?.trim();

      if (!priceId) {
        const prices = await stripe.prices.list({
          lookup_keys: [planCopy.lookupKey!],
          active: true,
          limit: 1,
        });
        priceId = prices.data[0]?.id;
      }

      if (!priceId) {
        return NextResponse.json(
          { success: false, error: "Founding Member Stripe price is not configured" },
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
        source: "schemapage_checkout",
      },
      subscription_data: {
        metadata: {
          slug: page.slug,
          plan,
          product: "credentials_ai",
        },
      },
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
