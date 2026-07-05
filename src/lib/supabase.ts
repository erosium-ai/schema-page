import { createClient } from "@supabase/supabase-js";
import { PageData } from "./types";

let cachedClient: ReturnType<typeof createClient> | null = null;

function getPublicClient() {
  if (cachedClient) return cachedClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  cachedClient = createClient(supabaseUrl, supabaseKey);
  return cachedClient;
}

export async function getPageBySlug(slug: string): Promise<PageData | null> {
  const supabase = getPublicClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return data as PageData;
}

export async function createPage(
  page: Omit<PageData, "id" | "created_at" | "updated_at">
): Promise<{ success: boolean; error?: string; data?: PageData }> {
  const supabase = getPublicClient();
  if (!supabase) {
    return { success: false, error: "Supabase env vars are missing" };
  }

  const client = supabase as any;
  const { data, error } = await client.from("pages").insert(page).select().single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: data as PageData };
}
