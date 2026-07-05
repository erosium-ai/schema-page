import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!serviceRoleKey || !supabaseUrl) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.slug || !body.business_name) {
      return NextResponse.json(
        { success: false, error: "slug and business_name are required" },
        { status: 400 }
      );
    }

    const slug = (body.slug as string).toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 60);

    if (slug.length < 2) {
      return NextResponse.json(
        { success: false, error: "Slug must be at least 2 characters after cleaning" },
        { status: 400 }
      );
    }

    const adminClient = getAdminClient();
    if (!adminClient) {
      return NextResponse.json(
        { success: false, error: "Supabase env vars missing on server" },
        { status: 500 }
      );
    }

    const { data, error } = await adminClient.from("pages")
      .insert({
        slug,
        business_name: body.business_name,
        tagline: body.tagline || null,
        description: body.description || null,
        services: body.services || [],
        contact_email: body.contact_email || null,
        contact_phone: body.contact_phone || null,
        website_url: body.website_url || null,
        location_address: body.location_address || null,
        brand_color: body.brand_color || "#22c55e",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");

  if (!slug) {
    return NextResponse.json(
      { success: false, error: "slug query param required" },
      { status: 400 }
    );
  }

  const adminClient = getAdminClient();
  if (!adminClient) {
    return NextResponse.json(
      { success: false, error: "Supabase env vars missing on server" },
      { status: 500 }
    );
  }

  const { data, error } = await adminClient.from("pages")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { success: false, error: "Page not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data });
}
