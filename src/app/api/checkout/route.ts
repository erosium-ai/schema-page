import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { stripe } from "@/lib/stripe";
import { getPageBySlug } from "@/lib/subscription";
import {
  FOUNDING_MEMBER_LOOKUP_KEY,
  getAiReadyPriceCopy,
  normalizeBillingCycle,
  normalizeCheckoutPlan,
} from "@/lib/checkout-plans";
import { isCurrentLegalPolicyVersions } from "@/lib/legal-policy";

const TERMINAL_CANCELED_STATUSES = new Set(["canceled", "cancelled"]);

// 15-minute reuse window for deterministic duplicate POST suppression.
const CHECKOUT_REUSE_WINDOW_SECONDS = 15 * 60;

type ExistingOpenCheckoutCandidate = {
  id: string;
  url: string | null;
  status: string | null;
  expires_at: number;
  metadata: Record<string, string> | null;
};

function getAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!serviceRoleKey || !supabaseUrl) {
    throw new Error("Supabase env vars missing on server");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function legalVersionKey(policyVersions: {
  terms?: string;
  privacy?: string;
  refunds?: string;
}): string {
  return [
    String(policyVersions.terms ?? ""),
    String(policyVersions.privacy ?? ""),
    String(policyVersions.refunds ?? ""),
  ].join("|");
}

function checkoutReuseBucket(nowMs: number): number {
  // Round to the nearest 15-minute anchor rather than flooring. Requests
  // immediately either side of a clock boundary therefore share the same
  // intent key unless they are more than half a window apart.
  return Math.round(nowMs / (CHECKOUT_REUSE_WINDOW_SECONDS * 1000));
}

function checkoutBucketStartIso(bucket: number): string {
  return new Date(bucket * CHECKOUT_REUSE_WINDOW_SECONDS * 1000).toISOString();
}

function buildCheckoutIntentFingerprint(input: {
  slug: string;
  plan: string;
  billingCycle: string;
  legalVersion: string;
  bucket: number;
}): string {
  const raw = [
    input.slug,
    input.plan,
    input.billingCycle,
    input.legalVersion,
    String(input.bucket),
  ].join("|");

  return createHash("sha256").update(raw).digest("hex").slice(0, 48);
}

function makeCheckoutIntentMetadata(input: {
  slug: string;
  plan: string;
  billingCycle: string;
  legalVersion: string;
  bucket: number;
  fingerprint: string;
}): Record<string, string> {
  return {
    checkout_intent_slug: input.slug,
    checkout_intent_plan: input.plan,
    checkout_intent_cycle: input.billingCycle,
    checkout_intent_legal: input.legalVersion,
    checkout_intent_bucket: String(input.bucket),
    checkout_intent_key: input.fingerprint,
  };
}

async function findReusableOpenCheckoutSession(params: {
  customerEmail?: string | null;
  fingerprint: string;
  minCreatedUnixSeconds: number;
}): Promise<ExistingOpenCheckoutCandidate | null> {
  const { customerEmail, fingerprint, minCreatedUnixSeconds } = params;
  if (!customerEmail) return null;

  const list = await stripe.checkout.sessions.list({
    customer_details: { email: customerEmail },
    status: "open",
    created: { gte: minCreatedUnixSeconds },
    limit: 20,
  });

  const nowUnix = Math.floor(Date.now() / 1000);

  const match = list.data.find((session) => {
    if (session.status !== "open") return false;
    if (!session.url) return false;
    if (typeof session.expires_at !== "number" || session.expires_at <= nowUnix) {
      return false;
    }
    return session.metadata?.checkout_intent_key === fingerprint;
  });

  if (!match) return null;

  return {
    id: match.id,
    url: match.url ?? null,
    status: match.status,
    expires_at: match.expires_at,
    metadata: (match.metadata ?? null) as Record<string, string> | null,
  };
}

async function hasBlockingPaidAssociation(slug: string): Promise<boolean> {
  const adminClient = getAdminClient();
  const { data, error } = await adminClient
    .from("business_profiles")
    .select("subscription_status, stripe_customer_id, stripe_subscription_id")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(`business_profiles lookup failed: ${error.message}`);
  }

  const status =
    typeof data?.subscription_status === "string"
      ? data.subscription_status.trim().toLowerCase()
      : "";

  const hasBillingAssociation =
    typeof data?.stripe_customer_id === "string" && data.stripe_customer_id.trim().length > 0
      ? true
      : typeof data?.stripe_subscription_id === "string" &&
          data.stripe_subscription_id.trim().length > 0;

  if (!hasBillingAssociation) {
    return false;
  }

  // Any existing Stripe association (customer/subscription ids) blocks duplicate
  // checkout unless status is explicitly terminal canceled/cancelled.
  // Unknown/incomplete statuses must still block.
  return !TERMINAL_CANCELED_STATUSES.has(status);
}

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

    if (await hasBlockingPaidAssociation(page.slug)) {
      return NextResponse.json(
        {
          success: false,
          code: "existing_paid_subscription",
          error:
            "This business already has an active or pending-cancellation Credentials AI subscription. Please use your existing billing, or resubscribe after cancellation is fully completed.",
        },
        { status: 409 }
      );
    }

    const credentialsAiDomain =
      process.env.CREDENTIALS_AI_DOMAIN || "https://credentialsai.com.au";
    const priceCopy = getAiReadyPriceCopy(billingCycle);

    const legalVersion = legalVersionKey(body.policyVersions);
    const nowMs = Date.now();
    const bucket = checkoutReuseBucket(nowMs);
    // This value is stored as legal evidence and is also part of Stripe's
    // idempotent request body. Make it deterministic within the reuse window so
    // parallel retries with the same idempotency key send byte-equivalent params.
    const legalAcceptedAt = checkoutBucketStartIso(bucket);

    const checkoutIntentKey = buildCheckoutIntentFingerprint({
      slug: page.slug,
      plan,
      billingCycle,
      legalVersion,
      bucket,
    });

    const intentMetadata = makeCheckoutIntentMetadata({
      slug: page.slug,
      plan,
      billingCycle,
      legalVersion,
      bucket,
      fingerprint: checkoutIntentKey,
    });

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

    const chosenCustomerEmail =
      page.creator_email?.trim() || page.contact_email?.trim() || null;

    const minCreatedUnixSeconds =
      Math.floor(nowMs / 1000) - CHECKOUT_REUSE_WINDOW_SECONDS;

    // Fast path: if an equivalent open Checkout Session already exists and is
    // still valid, reuse it.
    const reusable = await findReusableOpenCheckoutSession({
      customerEmail: chosenCustomerEmail,
      fingerprint: checkoutIntentKey,
      minCreatedUnixSeconds,
    });

    if (reusable?.url) {
      return NextResponse.json({
        success: true,
        url: reusable.url,
        reused: true,
        sessionId: reusable.id,
      });
    }

    const legalMetadata = {
      legal_accepted_at: legalAcceptedAt,
      terms_version: body.policyVersions.terms,
      privacy_version: body.policyVersions.privacy,
      refunds_version: body.policyVersions.refunds,
    };

    const idempotencyKey = `schemapage:checkout:${checkoutIntentKey}`;

    try {
      const session = await stripe.checkout.sessions.create(
        {
          mode: "subscription",
          line_items: [{ price: priceId, quantity: 1 }],
          success_url: `${credentialsAiDomain}/welcome?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${credentialsAiDomain}/pricing?checkout=cancelled`,
          ...(chosenCustomerEmail
            ? { customer_email: chosenCustomerEmail }
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
            ...intentMetadata,
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
              ...intentMetadata,
            },
          },
        },
        {
          // Deterministic idempotency key ensures simultaneous duplicate creates
          // for same slug+plan+cycle+legal+window resolve to one Checkout Session.
          idempotencyKey,
        }
      );

      return NextResponse.json({
        success: true,
        url: session.url,
        reused: false,
        sessionId: session.id,
      });
    } catch (createError) {
      // Recovery path: if Stripe created the session but this request failed
      // mid-flight, try re-finding the open intent-keyed session.
      const reusableAfterError = await findReusableOpenCheckoutSession({
        customerEmail: chosenCustomerEmail,
        fingerprint: checkoutIntentKey,
        minCreatedUnixSeconds,
      }).catch(() => null);

      if (reusableAfterError?.url) {
        return NextResponse.json({
          success: true,
          url: reusableAfterError.url,
          reused: true,
          sessionId: reusableAfterError.id,
        });
      }

      throw createError;
    }
  } catch (error) {
    console.error("checkout_session_failed", error);
    return NextResponse.json(
      { success: false, error: "Unable to start checkout" },
      { status: 500 }
    );
  }
}
