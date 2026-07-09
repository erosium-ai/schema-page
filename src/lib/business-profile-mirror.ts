// 🔑 Keywords: business_profiles mirror, checkout webhook, subscription upsert, Credentials AI Founding Member, pages fallback create
// Writes paid Founding Member state into the shared `business_profiles` table
// used by the Credentials AI (trustbadge) app. This is the safety-net path so
// membership state is always in the DB even if /welcome is never reached.
//
// This module talks to the SAME Supabase project used by the trustbadge app.
// SchemaPage already has SUPABASE_URL / SERVICE_ROLE_KEY on its Railway env,
// which points at that shared project.
//
// Fallback path: if no business_profiles row exists yet for this slug when
// payment lands, we hydrate one directly from the SchemaPage `pages` table so
// membership state can still be recorded. This closes the gap where a paid
// customer could get stuck on the /welcome fallback "check your inbox" screen.

import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export interface FoundingMirrorPayload {
  slug: string;
  paymentEmail?: string | null;
  customerId?: string | null;
  subscriptionId?: string | null;
  subscriptionStatus?: string | null;
  nextPaymentAt?: string | null; // ISO
}

export async function mirrorFoundingMemberState(
  payload: FoundingMirrorPayload
): Promise<{ ok: boolean; reason?: string; foundingNumber?: number | null }> {
  const client = getAdminClient();
  if (!client) {
    console.info("[credentials-ai][mirror] no supabase env — skipping mirror", payload.slug);
    return { ok: false, reason: "no_env" };
  }

  const slug = payload.slug.trim().toLowerCase();
  if (!slug) return { ok: false, reason: "no_slug" };

  // Find existing business_profiles row for this slug.
  const { data: existing, error: fetchErr } = await client
    .from("business_profiles")
    .select("id, plan, founding_number")
    .eq("slug", slug)
    .maybeSingle();

  if (fetchErr) {
    console.warn("[credentials-ai][mirror] fetch failed", {
      slug,
      code: fetchErr.code,
      message: fetchErr.message,
    });
    // Don't hard-fail — the row may not exist yet in every environment.
  }

  const updatePayload: Record<string, unknown> = {
    plan: "founder",
    subscription_status: payload.subscriptionStatus ?? null,
    stripe_customer_id: payload.customerId ?? null,
    stripe_subscription_id: payload.subscriptionId ?? null,
    next_payment_at: payload.nextPaymentAt ?? null,
    payment_email: payload.paymentEmail ?? null,
    updated_at: new Date().toISOString(),
  };

  let effectiveId: string | null = existing?.id ?? null;

  if (existing?.id) {
    const { error: updErr } = await client
      .from("business_profiles")
      .update(updatePayload)
      .eq("id", existing.id);
    if (updErr) {
      console.warn("[credentials-ai][mirror] update failed", {
        slug,
        code: updErr.code,
        message: updErr.message,
      });
      return { ok: false, reason: updErr.message };
    }
  } else {
    // Hydrate a fresh business_profiles row from the SchemaPage `pages` table
    // so paid customers never get stuck on the /welcome fallback screen.
    console.info(
      "[credentials-ai][mirror] no existing business_profiles row — hydrating from pages",
      slug
    );

    const { data: page, error: pageErr } = await client
      .from("pages")
      .select(
        "id, slug, business_name, tagline, description, services, contact_email, contact_phone, website_url, location_address, social_links, metadata"
      )
      .eq("slug", slug)
      .maybeSingle();

    if (pageErr) {
      console.warn("[credentials-ai][mirror] pages lookup failed", {
        slug,
        code: pageErr.code,
        message: pageErr.message,
      });
      return { ok: false, reason: `pages_lookup_failed: ${pageErr.message}` };
    }
    if (!page) {
      console.warn("[credentials-ai][mirror] no pages row for slug", slug);
      return { ok: false, reason: "pages_row_missing" };
    }

    const p = page as {
      id: string;
      business_name: string;
      tagline: string | null;
      description: string | null;
      services: unknown;
      contact_email: string | null;
      contact_phone: string | null;
      website_url: string | null;
      location_address: string | null;
      social_links: unknown;
      metadata: unknown;
    };

    const insertPayload: Record<string, unknown> = {
      source_page_id: p.id,
      slug,
      business_name: p.business_name,
      description: p.description ?? null,
      phone: p.contact_phone ?? null,
      email: p.contact_email ?? null,
      website: p.website_url ?? null,
      services: Array.isArray(p.services) ? p.services : [],
      social_links:
        p.social_links && typeof p.social_links === "object" ? p.social_links : {},
      metadata: {
        ...(p.metadata && typeof p.metadata === "object"
          ? (p.metadata as Record<string, unknown>)
          : {}),
        tagline: p.tagline ?? null,
        location_address: p.location_address ?? null,
        hydrated_from_pages_at: new Date().toISOString(),
      },
      plan: "founder",
      status: "active",
      subscription_status: payload.subscriptionStatus ?? null,
      stripe_customer_id: payload.customerId ?? null,
      stripe_subscription_id: payload.subscriptionId ?? null,
      next_payment_at: payload.nextPaymentAt ?? null,
      payment_email: payload.paymentEmail ?? null,
    };

    const { data: inserted, error: insertErr } = await client
      .from("business_profiles")
      .insert(insertPayload)
      .select("id")
      .maybeSingle();

    if (insertErr) {
      // Handle race with /welcome hydration path.
      if (insertErr.code === "23505" || insertErr.message?.includes("duplicate")) {
        const { data: raced } = await client
          .from("business_profiles")
          .select("id")
          .eq("slug", slug)
          .maybeSingle();
        if (raced?.id) {
          const { error: raceUpdErr } = await client
            .from("business_profiles")
            .update(updatePayload)
            .eq("id", raced.id);
          if (raceUpdErr) {
            console.warn("[credentials-ai][mirror] race update failed", {
              slug,
              code: raceUpdErr.code,
              message: raceUpdErr.message,
            });
            return { ok: false, reason: raceUpdErr.message };
          }
          effectiveId = raced.id as string;
        }
      } else {
        console.warn("[credentials-ai][mirror] hydrate insert failed", {
          slug,
          code: insertErr.code,
          message: insertErr.message,
        });
        return { ok: false, reason: `hydrate_insert_failed: ${insertErr.message}` };
      }
    } else if (inserted?.id) {
      effectiveId = inserted.id as string;
    }
  }

  // Assign founding_number atomically via the migration RPC. Safe to call
  // multiple times; only assigns once per slug.
  let foundingNumber: number | null = existing?.founding_number ?? null;
  if (effectiveId && foundingNumber == null) {
    const { data: rpcData, error: rpcErr } = await client.rpc(
      "credentials_ai_assign_founding_number",
      { target_slug: slug }
    );
    if (rpcErr) {
      console.warn("[credentials-ai][mirror] founding_number rpc failed", {
        slug,
        code: rpcErr.code,
        message: rpcErr.message,
      });
    } else if (typeof rpcData === "number") {
      foundingNumber = rpcData;
    }
  }

  return { ok: true, foundingNumber };
}
