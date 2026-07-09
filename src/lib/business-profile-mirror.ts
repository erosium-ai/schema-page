// 🔑 Keywords: business_profiles mirror, checkout webhook, subscription upsert, Credentials AI Founding Member
// Writes paid Founding Member state into the shared `business_profiles` table
// used by the Credentials AI (trustbadge) app. This is the safety-net path so
// membership state is always in the DB even if /welcome is never reached.
//
// This module talks to the SAME Supabase project used by the trustbadge app.
// SchemaPage already has SUPABASE_URL / SERVICE_ROLE_KEY on its Railway env,
// which points at that shared project.

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
    // Do not create a brand-new business_profiles row from the webhook — the
    // /welcome flow is the source of truth for that. Just log for visibility.
    console.info("[credentials-ai][mirror] no existing business_profiles row for slug", slug);
  }

  // Assign founding_number atomically via the migration RPC. Safe to call
  // multiple times; only assigns once per slug.
  let foundingNumber: number | null = existing?.founding_number ?? null;
  if (existing?.id && foundingNumber == null) {
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
