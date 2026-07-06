import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getPageBySlug } from "@/lib/subscription";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const slug = typeof body.slug === "string" ? body.slug.trim() : "";

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
    const successUrl = `${siteUrl}/${page.slug}?checkout=success`;
    const cancelUrl = `${siteUrl}/${page.slug}?checkout=cancelled`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "aud",
            product_data: {
              name: "SchemaPage Pro Upgrade",
              description: `Pro upgrade for ${page.business_name}`,
            },
            unit_amount: 2900,
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        slug: page.slug,
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
