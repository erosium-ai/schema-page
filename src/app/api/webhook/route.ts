import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { markPageAsPro } from "@/lib/subscription";
import { notifyFounderNewMember } from "@/lib/notify";
import { mirrorFoundingMemberState } from "@/lib/business-profile-mirror";
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
      const plan = session.metadata?.plan;
      const businessName = session.metadata?.business_name;

      if (slug) {
        // Legacy: keep SchemaPage `is_pro=true` so the profile page shows paid.
        try {
          await markPageAsPro(slug);
        } catch (err) {
          console.warn("[webhook] markPageAsPro failed", {
            slug,
            error: (err as Error).message,
          });
        }

        const isFoundingCheckout =
          plan === "verified_lead_engine" || plan === "founding";

        if (isFoundingCheckout) {
          const customerId =
            typeof session.customer === "string"
              ? session.customer
              : session.customer?.id ?? null;

          const subscriptionId =
            typeof session.subscription === "string"
              ? session.subscription
              : session.subscription?.id ?? null;

          // Pull the subscription to get current_period_end + status.
          let nextPaymentAt: string | null = null;
          let subscriptionStatus: string | null = null;
          if (subscriptionId) {
            try {
              // Cast to unknown → SubscriptionLike because the current Stripe
              // typings return a Response<Subscription> wrapper for retrieve
              // that hides the resource fields at the type level. The runtime
              // shape is still the subscription resource.
              type SubscriptionLike = {
                status?: string;
                current_period_end?: number;
              };
              const sub = (await stripe.subscriptions.retrieve(
                subscriptionId
              )) as unknown as SubscriptionLike;
              subscriptionStatus = sub.status ?? null;
              if (typeof sub.current_period_end === "number") {
                nextPaymentAt = new Date(
                  sub.current_period_end * 1000
                ).toISOString();
              }
            } catch (err) {
              console.warn("[webhook] subscription retrieve failed", {
                subscriptionId,
                error: (err as Error).message,
              });
            }
          }

          const paymentEmail =
            session.customer_details?.email ||
            session.customer_email ||
            null;

          // Mirror state into business_profiles (best-effort).
          try {
            await mirrorFoundingMemberState({
              slug,
              paymentEmail,
              customerId,
              subscriptionId,
              subscriptionStatus,
              nextPaymentAt,
            });
          } catch (err) {
            console.warn("[webhook] mirror failed", {
              slug,
              error: (err as Error).message,
            });
          }

          // Notify founder (best-effort).
          try {
            await notifyFounderNewMember({
              slug,
              businessName: businessName ?? null,
              paymentEmail,
              customerId,
              subscriptionId,
              sessionId: session.id,
              amountAud: session.amount_total ?? null,
              plan: plan ?? null,
            });
          } catch (err) {
            console.warn("[webhook] founder notify failed", {
              slug,
              error: (err as Error).message,
            });
          }
        }
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
