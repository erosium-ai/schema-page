"use client";

import { useState } from "react";
import { PageData, ServiceItem } from "@/lib/types";
import { sanitizeSlug } from "@/lib/slug";

interface BuilderFormProps {
  onPageCreated?: (page: PageData) => void;
  intent?: "free" | "pro";
}

export default function BuilderForm({ onPageCreated, intent = "free" }: BuilderFormProps) {
  const [serviceCount, setServiceCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [proCheckoutLoading, setProCheckoutLoading] = useState(false);
  const [proCheckoutError, setProCheckoutError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);
  const [slugValue, setSlugValue] = useState("");
  const [slugEditedManually, setSlugEditedManually] = useState(false);
  const isProIntent = intent === "pro";

  const credentialsAiBaseUrl =
    process.env.NEXT_PUBLIC_CREDENTIALS_AI_URL ||
    process.env.NEXT_PUBLIC_TRUSTBADGE_URL ||
    "https://trustbadge-production-018a.up.railway.app";

  const trackingSource = "schemapage";
  const trackingCampaign = "post_create_upsell";
  const trackingMedium = "in_app";
  const trackingContent = "success_state_block";

  const startProCheckout = async (slug: string): Promise<boolean> => {
    setProCheckoutLoading(true);
    setProCheckoutError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.url) {
        setProCheckoutError(data.error || "Unable to start Pro checkout. Please try again.");
        return false;
      }

      window.location.href = data.url;
      return true;
    } catch (err) {
      setProCheckoutError((err as Error).message || "Unable to start Pro checkout.");
      return false;
    } finally {
      setProCheckoutLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    setCreatedSlug(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const services: ServiceItem[] = [];
    for (let i = 0; i < serviceCount; i++) {
      const name = formData.get(`service_name_${i}`) as string;
      if (name?.trim()) {
        services.push({
          name: name.trim(),
          price: (formData.get(`service_price_${i}`) as string) || undefined,
          description: (formData.get(`service_desc_${i}`) as string) || undefined,
        });
      }
    }

    const payload = {
      slug: sanitizeSlug(slugValue || String(formData.get("slug") || "")),
      business_name: (formData.get("business_name") as string).trim(),
      tagline: (formData.get("tagline") as string)?.trim() || undefined,
      description: (formData.get("description") as string)?.trim() || undefined,
      services: services.length > 0 ? services : undefined,
      contact_email: (formData.get("contact_email") as string)?.trim() || undefined,
      contact_phone: (formData.get("contact_phone") as string)?.trim() || undefined,
      website_url: (formData.get("website_url") as string)?.trim() || undefined,
      location_address: (formData.get("location_address") as string)?.trim() || undefined,
      brand_color: (formData.get("brand_color") as string) || "#22c55e",
    };

    try {
      const res = await fetch("/api/page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || "Failed to create page");
      }

      setSuccess(true);
      setCreatedSlug(result.data.slug);
      onPageCreated?.(result.data);

      if (isProIntent) {
        await startProCheckout(result.data.slug);
      }

      form.reset();
      setServiceCount(1);
      setSlugValue("");
      setSlugEditedManually(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleStartProCheckout = async () => {
    if (!createdSlug) return;

    await startProCheckout(createdSlug);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isProIntent && (
        <div className="rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-900">
          <p className="font-semibold">You&apos;re starting Pro AI Presence.</p>
          <p className="mt-1">
            Step 1: create your AI-readable page. Step 2: continue to Pro checkout.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Business Name *</label>
          <input
            name="business_name"
            required
            minLength={2}
            maxLength={120}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="Joe's Plumbing"
            onChange={(e) => {
              if (!slugEditedManually || !slugValue) {
                setSlugValue(sanitizeSlug(e.currentTarget.value));
              }
            }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Your page name * <span className="font-normal text-gray-600">(enter business or webpage name)</span>
          </label>
          <input
            name="slug"
            required
            minLength={2}
            maxLength={60}
            pattern="[a-z0-9-]+"
            value={slugValue}
            onChange={(e) => {
              setSlugEditedManually(true);
              setSlugValue(sanitizeSlug(e.currentTarget.value));
            }}
            className="w-full border rounded-lg px-3 py-2 text-brand-600 font-medium placeholder:text-brand-600/70 focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="joes-plumbing"
          />
          <p className="text-xs text-gray-500 mt-1">
            We suggest you use your business name so customers can find you easily.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Example: <span className="font-medium">www.schemapage.com/</span>
            <span className="font-semibold text-brand-600">joes-plumbing</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Preview: <span className="font-medium">www.schemapage.com/</span>
            <span className="font-semibold text-brand-600">{slugValue || "your-business-name"}</span>
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tagline</label>
        <input
          name="tagline"
          maxLength={160}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
          placeholder="We make the best widgets"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          rows={3}
          maxLength={4000}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
          placeholder="Tell visitors what you do..."
        />
        <p className="mt-1 text-xs text-gray-500">
          Tip: include how you help customers and where you service so your business can rank higher in AI results across ChatGPT, Gemini, Grok, and Claude.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Services</label>
        <div className="space-y-3">
          {Array.from({ length: serviceCount }).map((_, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                name={`service_name_${i}`}
                placeholder="Service name"
                maxLength={100}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <input
                name={`service_price_${i}`}
                placeholder="Price"
                maxLength={60}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <input
                name={`service_desc_${i}`}
                placeholder="Short description"
                maxLength={280}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setServiceCount((c) => c + 1)}
          className="mt-2 text-sm text-brand-600 hover:text-brand-700 font-medium"
        >
          + Add another service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Contact Email</label>
          <input
            name="contact_email"
            type="email"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="hello@acme.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            name="contact_phone"
            maxLength={40}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="+1 555 123 4567"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Website</label>
          <input
            name="website_url"
            type="url"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="https://acme.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            name="location_address"
            maxLength={240}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="123 Main St, Brisbane"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Brand Color</label>
        <div className="flex items-center gap-3">
          <input
            name="brand_color"
            type="color"
            defaultValue="#22c55e"
            className="h-10 w-20 border rounded cursor-pointer"
          />
          <span className="text-sm text-gray-600">Pick your brand accent</span>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
      )}

      {success && (
        <div className="space-y-4">
          <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">
            <p>Page created! Your AI-Agent Friendly page is live.</p>
            {createdSlug && (
              <p className="mt-1">
                Open: <a className="underline" href={`/${createdSlug}`} target="_blank" rel="noreferrer">/{createdSlug}</a>
              </p>
            )}
          </div>

          {createdSlug && (
            <div className="rounded-xl border border-brand-200 bg-brand-50/40 p-4 sm:p-5">
              <p className="text-sm font-semibold text-brand-800">Next step: turn this into a full trust + conversion funnel</p>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <a
                  href={`/${createdSlug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition"
                >
                  View my live page
                </a>
                <button
                  type="button"
                  onClick={handleStartProCheckout}
                  disabled={proCheckoutLoading}
                  className="inline-flex items-center justify-center rounded-lg border border-brand-600 bg-white px-4 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50 transition disabled:opacity-60"
                >
                  {proCheckoutLoading ? "Opening Pro checkout..." : "Start Pro AI Presence"}
                </button>
                <a
                  href={`${credentialsAiBaseUrl}/auth/register?${new URLSearchParams({
                    source: trackingSource,
                    slug: createdSlug,
                    campaign: trackingCampaign,
                    utm_source: trackingSource,
                    utm_medium: trackingMedium,
                    utm_campaign: trackingCampaign,
                    utm_content: trackingContent,
                  }).toString()}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-lg border border-brand-600 bg-white px-4 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50 transition"
                >
                  Get TrustBadge verification
                </a>
              </div>
              {proCheckoutError && (
                <p className="mt-2 text-xs text-red-700">{proCheckoutError}</p>
              )}
              <p className="mt-3 text-xs text-brand-900/80">
                Pro AI Presence <span className="font-semibold">$19/mo</span> + TrustBadge verification gives you stronger trust signals for customers and AI agents.
              </p>
            </div>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
      >
        {loading
          ? "Creating..."
          : isProIntent
            ? "Create page & continue to Pro checkout"
            : "Create AI-Agent Readable Page"}
      </button>
    </form>
  );
}
