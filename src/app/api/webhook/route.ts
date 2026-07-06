import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { markPageAsPro } from "@/lib/subscription";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { success: false, error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { success: false, error: "STRIPE_WEBHOOK_SECRET is not set" },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 400 }
    );
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const slug = session.metadata?.slug;

      if (slug) {
        await markPageAsPro(slug);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message || "Webhook handler failed" },
      { status: 500 }
    );
  }
}


