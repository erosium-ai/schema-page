import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createHash } from "node:crypto";
import { isValidSlug, sanitizeSlug } from "@/lib/slug";

const RATE_LIMIT_PER_24H = 1;

function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex");
}

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;

  return "unknown";
}

function sanitizeOptionalUrl(input: unknown): string | null {
  const value = String(input || "").trim();
  if (!value) return null;

  const parsed = new URL(value);
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Invalid URL protocol");
  }

  return value;
}

type AdminClient = NonNullable<ReturnType<typeof getAdminClient>>;

async function checkRateLimit(
  adminClient: AdminClient,
  ipHash: string
): Promise<{ ok: boolean; error?: string }> {
  if (ipHash === hashIp("unknown")) {
    return { ok: true };
  }

  const { count, error } = await adminClient
    .from("page_creations")
    .select("*", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gt("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

  if (error) {
    return { ok: false, error: error.message };
  }

  if (count && count >= RATE_LIMIT_PER_24H) {
    return {
      ok: false,
      error:
        "You've already created a page recently. Please upgrade to Pro to create more, or try again in 24 hours.",
    };
  }

  return { ok: true };
}

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

    const slug = sanitizeSlug(body.slug as string);

    if (!isValidSlug(slug)) {
      return NextResponse.json(
        { success: false, error: "Slug must be 2-60 chars, lowercase, numbers, and hyphens only" },
        { status: 400 }
      );
    }

    const businessName = String(body.business_name || "").trim();
    if (businessName.length < 2 || businessName.length > 120) {
      return NextResponse.json(
        { success: false, error: "business_name must be between 2 and 120 characters" },
        { status: 400 }
      );
    }

    const tagline = String(body.tagline || "").trim().slice(0, 160) || null;
    const description = String(body.description || "").trim().slice(0, 4000) || null;
    const contactEmail = String(body.contact_email || "").trim() || null;
    const contactPhone = String(body.contact_phone || "").trim().slice(0, 40) || null;
    const websiteUrl = String(body.website_url || "").trim() || null;
    const locationAddress = String(body.location_address || "").trim().slice(0, 240) || null;
    const brandColor = /^#[0-9a-fA-F]{6}$/.test(String(body.brand_color || ""))
      ? String(body.brand_color)
      : "#22c55e";

    const socialLinksInput =
      body.social_links && typeof body.social_links === "object"
        ? (body.social_links as Record<string, unknown>)
        : {};

    let socialLinks: {
      facebook: string | null;
      instagram: string | null;
      linkedin: string | null;
      twitter: string | null;
    };

    try {
      socialLinks = {
        facebook: socialLinksInput.facebook ? sanitizeOptionalUrl(socialLinksInput.facebook) : null,
        instagram: socialLinksInput.instagram ? sanitizeOptionalUrl(socialLinksInput.instagram) : null,
        linkedin: socialLinksInput.linkedin ? sanitizeOptionalUrl(socialLinksInput.linkedin) : null,
        twitter: socialLinksInput.twitter ? sanitizeOptionalUrl(socialLinksInput.twitter) : null,
      };
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid social link URL (must start with http or https)" },
        { status: 400 }
      );
    }

    const faqsInput: unknown[] = Array.isArray(body.faqs) ? body.faqs : [];
    const faqs = faqsInput
      .map((item: unknown) => {
        const faq = item as { question?: string; answer?: string };
        return {
          question: String(faq?.question || "").trim().slice(0, 180),
          answer: String(faq?.answer || "").trim().slice(0, 600),
        };
      })
      .filter((faq) => faq.question.length > 0 && faq.answer.length > 0)
      .slice(0, 8);

    if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      return NextResponse.json(
        { success: false, error: "Invalid contact_email" },
        { status: 400 }
      );
    }

    if (websiteUrl) {
      try {
        sanitizeOptionalUrl(websiteUrl);
      } catch {
        return NextResponse.json(
          { success: false, error: "Invalid website_url" },
          { status: 400 }
        );
      }
    }

    const servicesInput = Array.isArray(body.services) ? body.services : [];
    const services = servicesInput
      .map((service: unknown) => {
        const item = service as { name?: string; price?: string; description?: string };
        return {
          name: String(item?.name || "").trim().slice(0, 100),
          price: String(item?.price || "").trim().slice(0, 60),
          description: String(item?.description || "").trim().slice(0, 280),
        };
      })
      .filter((service: { name: string }) => service.name.length > 0)
      .slice(0, 20);

    if (servicesInput.length > 20) {
      return NextResponse.json(
        { success: false, error: "Maximum 20 services allowed" },
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

    const clientIp = getClientIp(req);
    const ipHash = hashIp(clientIp);

    const rateLimit = await checkRateLimit(adminClient, ipHash);
    if (!rateLimit.ok) {
      return NextResponse.json(
        { success: false, error: rateLimit.error },
        { status: 429 }
      );
    }

    const { data, error } = await adminClient.from("pages")
      .insert({
        slug,
        business_name: businessName,
        tagline,
        description,
        services,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        website_url: websiteUrl,
        location_address: locationAddress,
        social_links: socialLinks,
        metadata: faqs.length > 0 ? { faqs } : {},
        brand_color: brandColor,
      })
      .select()
      .single();

    if (error) {
      const status = error.code === "23505" ? 409 : 500;
      const message = error.code === "23505"
        ? "That slug is already taken. Try another one."
        : error.message;
      return NextResponse.json(
        { success: false, error: message },
        { status }
      );
    }

    // Record creation for IP-based rate limiting (privacy-safe; hashed IP)
    if (clientIp !== "unknown") {
      await adminClient.from("page_creations").insert({
        ip_hash: ipHash,
        slug,
      });
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
  const slugRaw = req.nextUrl.searchParams.get("slug");
  const slug = sanitizeSlug(slugRaw || "");

  if (!isValidSlug(slug)) {
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
