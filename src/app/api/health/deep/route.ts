import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { isHealthCheckAuthorized } from "@/lib/health-auth";

export const dynamic = "force-dynamic";

const CANARY_SLUG =
  process.env.CREDENTIALS_AI_HEALTHCHECK_CANARY_SLUG?.trim() || "beastly-tech-gc";

function validateStripePrice(
  price: {
    active: boolean;
    currency: string;
    unit_amount: number | null;
    recurring: { interval: string } | null;
    product: unknown;
  },
  expected: { amount: number; interval: "month" | "week"; label: "monthly" | "weekly" }
) {
  const failures: string[] = [];
  const product = price.product;
  const productActive =
    typeof product === "string"
      ? null
      : product && typeof product === "object" && "deleted" in product
        ? (product as { deleted?: unknown; active?: unknown }).deleted
          ? null
          : (product as { active?: unknown }).active === true
            ? true
            : (product as { active?: unknown }).active === false
              ? false
              : null
        : null;

  if (!price.active) failures.push(`stripe_price_${expected.label}:not_active`);
  if (productActive === false) failures.push(`stripe_product_${expected.label}:not_active`);
  if (price.currency.toLowerCase() !== "aud") {
    failures.push(`stripe_price_${expected.label}:currency_mismatch`);
  }
  if (price.unit_amount !== expected.amount) {
    failures.push(`stripe_price_${expected.label}:amount_mismatch`);
  }
  if (price.recurring?.interval !== expected.interval) {
    failures.push(`stripe_price_${expected.label}:interval_mismatch`);
  }

  return failures;
}

export async function GET(request: NextRequest) {
  if (!isHealthCheckAuthorized(request)) {
    return NextResponse.json({ status: "unauthorized" }, { status: 401 });
  }

  const startedAt = Date.now();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const monthlyPriceId =
    process.env.STRIPE_AI_READY_MONTHLY_PRICE_ID?.trim() ||
    process.env.STRIPE_FOUNDING_MEMBER_PRICE_ID?.trim();
  const weeklyPriceId = process.env.STRIPE_AI_READY_WEEKLY_PRICE_ID?.trim();

  if (
    !supabaseUrl ||
    !serviceRoleKey ||
    !monthlyPriceId ||
    !weeklyPriceId ||
    !process.env.STRIPE_SECRET_KEY
  ) {
    return NextResponse.json(
      {
        status: "fail",
        service: "schemapage",
        checks: ["required_server_config:missing"],
        duration_ms: Date.now() - startedAt,
      },
      { status: 503 }
    );
  }

  try {
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const [pageResult, monthlyPrice, weeklyPrice] = await Promise.all([
      supabase
        .from("pages")
        .select("id,slug,business_name")
        .eq("slug", CANARY_SLUG)
        .maybeSingle(),
      stripe.prices.retrieve(monthlyPriceId, { expand: ["product"] }),
      stripe.prices.retrieve(weeklyPriceId, { expand: ["product"] }),
    ]);

    const failures: string[] = [];
    if (pageResult.error) failures.push(`page_read:${pageResult.error.code || "error"}`);
    if (!pageResult.data) failures.push("page_canary:missing");

    failures.push(
      ...validateStripePrice(monthlyPrice, {
        amount: 4900,
        interval: "month",
        label: "monthly",
      }),
      ...validateStripePrice(weeklyPrice, {
        amount: 1290,
        interval: "week",
        label: "weekly",
      })
    );

    if (failures.length > 0) {
      return NextResponse.json(
        {
          status: "fail",
          service: "schemapage",
          checks: failures,
          duration_ms: Date.now() - startedAt,
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      status: "ok",
      service: "schemapage",
      checks: {
        supabase: "ok",
        page_canary: "ok",
        stripe_product_monthly: "ok",
        stripe_price_monthly: "ok",
        stripe_product_weekly: "ok",
        stripe_price_weekly: "ok",
      },
      duration_ms: Date.now() - startedAt,
    });
  } catch (error) {
    console.error("[health/deep] read-only health check failed", error);
    return NextResponse.json(
      {
        status: "fail",
        service: "schemapage",
        checks: ["deep_health_exception"],
        duration_ms: Date.now() - startedAt,
      },
      { status: 503 }
    );
  }
}
