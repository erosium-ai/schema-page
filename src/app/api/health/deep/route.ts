import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { isHealthCheckAuthorized } from "@/lib/health-auth";

export const dynamic = "force-dynamic";

const CANARY_SLUG =
  process.env.CREDENTIALS_AI_HEALTHCHECK_CANARY_SLUG?.trim() || "beastly-tech-gc";

export async function GET(request: NextRequest) {
  if (!isHealthCheckAuthorized(request)) {
    return NextResponse.json({ status: "unauthorized" }, { status: 401 });
  }

  const startedAt = Date.now();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const priceId = process.env.STRIPE_FOUNDING_MEMBER_PRICE_ID?.trim();

  if (!supabaseUrl || !serviceRoleKey || !priceId || !process.env.STRIPE_SECRET_KEY) {
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

    const [pageResult, price] = await Promise.all([
      supabase
        .from("pages")
        .select("id,slug,business_name")
        .eq("slug", CANARY_SLUG)
        .maybeSingle(),
      stripe.prices.retrieve(priceId, { expand: ["product"] }),
    ]);

    const failures: string[] = [];
    if (pageResult.error) failures.push(`page_read:${pageResult.error.code || "error"}`);
    if (!pageResult.data) failures.push("page_canary:missing");

    const productActive =
      typeof price.product === "string" || price.product.deleted ? null : price.product.active;
    if (!price.active) failures.push("stripe_price:not_active");
    if (productActive === false) failures.push("stripe_product:not_active");
    if (price.currency.toLowerCase() !== "aud") failures.push("stripe_price:currency_mismatch");
    if (price.unit_amount !== 4900) failures.push("stripe_price:amount_mismatch");
    if (price.recurring?.interval !== "month") failures.push("stripe_price:interval_mismatch");

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
        stripe_product: "ok",
        stripe_price: "ok",
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
