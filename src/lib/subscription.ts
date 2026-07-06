import { createClient } from "@supabase/supabase-js";
import { PageData } from "./types";

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

export async function getPageBySlug(slug: string): Promise<PageData | null> {
  const adminClient = getAdminClient();

  const { data, error } = await adminClient
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return data as PageData;
}

export async function markPageAsPro(slug: string): Promise<void> {
  const adminClient = getAdminClient();

  const { error } = await adminClient
    .from("pages")
    .update({ is_pro: true })
    .eq("slug", slug);

  if (error) {
    throw new Error(error.message);
  }
}
