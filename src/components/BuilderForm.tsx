"use client";

import { useState } from "react";
import { PageData, ServiceItem } from "@/lib/types";
import { sanitizeSlug } from "@/lib/slug";

interface BuilderFormProps {
  onPageCreated?: (page: PageData) => void;
  intent?: "free" | "pro" | "verified_lead_engine";
}

const PRO_AI_PRESENCE_BENEFITS = [
  "Enhanced AI-readable business page",
  "Structured data built for ChatGPT, Gemini, Grok, Claude, and Google",
  "Service area + category optimisation",
  "FAQ section written for AI/search answers",
  "Click-to-call / website / social links",
  "QR-code-ready page link",
  "Basic conversion tracking",
];

const VERIFIED_LEAD_ENGINE_BENEFITS = [
  "Everything in the free AI-readable profile",
  "Credentials AI lead profile with quote form and click tracking",
  "TrustBadge verification for up to 3 credentials",
  "Tracked calls, email clicks, quote requests, and source attribution",
  "Instant lead alerts and weekly proof summary",
  "Founder-assisted setup with the $149 setup fee waived",
];

export default function BuilderForm({ onPageCreated, intent = "free" }: BuilderFormProps) {
  const [serviceCount, setServiceCount] = useState(1);
  const [faqCount, setFaqCount] = useState(2);
  const [loading, setLoading] = useState(false);
  const [proCheckoutLoading, setProCheckoutLoading] = useState(false);
  const [proCheckoutError, setProCheckoutError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);
  const [slugValue, setSlugValue] = useState("");
  const [slugEditedManually, setSlugEditedManually] = useState(false);
  const isProIntent = intent === "pro";
  const isVerifiedLeadEngineIntent = intent === "verified_lead_engine";
  const isPaidIntent = isProIntent || isVerifiedLeadEngineIntent;

  const startProCheckout = async (
    slug: string,
    checkoutIntent: "pro" | "verified_lead_engine" = isVerifiedLeadEngineIntent ? "verified_lead_engine" : "pro"
  ): Promise<boolean> => {
    setProCheckoutLoading(true);
    setProCheckoutError(null);
    window.location.href = checkoutIntent === "verified_lead_engine"
      ? `/checkout/founding/${encodeURIComponent(slug)}`
      : `/checkout/pro/${encodeURIComponent(slug)}`;
    return true;
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

    const faqs: Array<{ question: string; answer: string }> = [];
    for (let i = 0; i < faqCount; i++) {
      const question = String(formData.get(`faq_question_${i}`) || "").trim();
      const answer = String(formData.get(`faq_answer_${i}`) || "").trim();
      if (question && answer) {
        faqs.push({ question, answer });
      }
    }

    const socialLinks = {
      facebook: String(formData.get("social_facebook") || "").trim() || undefined,
      instagram: String(formData.get("social_instagram") || "").trim() || undefined,
      linkedin: String(formData.get("social_linkedin") || "").trim() || undefined,
      twitter: String(formData.get("social_twitter") || "").trim() || undefined,
    };

    const payload = {
      slug: sanitizeSlug(slugValue || String(formData.get("slug") || "")),
      business_name: (formData.get("business_name") as string).trim(),
      tagline: (formData.get("tagline") as string)?.trim() || undefined,
      description: (formData.get("description") as string)?.trim() || undefined,
      services: services.length > 0 ? services : undefined,
      creator_email: (formData.get("creator_email") as string)?.trim() || undefined,
      contact_email: (formData.get("contact_email") as string)?.trim() || undefined,
      contact_phone: (formData.get("contact_phone") as string)?.trim() || undefined,
      website_url: (formData.get("website_url") as string)?.trim() || undefined,
      location_address: (formData.get("location_address") as string)?.trim() || undefined,
      social_links: socialLinks,
      faqs,
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

      if (isPaidIntent) {
        await startProCheckout(result.data.slug);
      }

      form.reset();
      setServiceCount(1);
      setFaqCount(2);
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

    await startProCheckout(createdSlug, "verified_lead_engine");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isPaidIntent && (
        <div className="rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-900">
          <p className="font-semibold">
            You&apos;re starting {isVerifiedLeadEngineIntent ? "Verified Lead Engine" : "Pro AI Presence"}.
          </p>
          <p className="mt-1">
            Step 1: create your AI-readable page. Step 2: continue to secure checkout.
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
          <label className="block text-sm font-medium mb-1">Your Email *</label>
          <input
            name="creator_email"
            type="email"
            required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="you@example.com"
          />
          <p className="text-xs text-gray-500 mt-1">
            We&apos;ll use this to follow up with page tips and upgrade offers. We won&apos;t share it.
          </p>
        </div>
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

      <section className="rounded-xl border border-sky-200 bg-sky-50/60 p-4">
        <h3 className="text-sm font-bold text-sky-900">Pro-ready social links</h3>
        <p className="mt-1 text-xs text-sky-800">
          These power your Pro social/contact visibility block.
        </p>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            name="social_facebook"
            type="url"
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="https://facebook.com/yourbusiness"
          />
          <input
            name="social_instagram"
            type="url"
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="https://instagram.com/yourbusiness"
          />
          <input
            name="social_linkedin"
            type="url"
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="https://linkedin.com/company/yourbusiness"
          />
          <input
            name="social_twitter"
            type="url"
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="https://x.com/yourbusiness"
          />
        </div>
      </section>

      <section className="rounded-xl border border-violet-200 bg-violet-50/60 p-4">
        <h3 className="text-sm font-bold text-violet-900">Pro-ready FAQ section</h3>
        <p className="mt-1 text-xs text-violet-800">
          Add answers customers and AI search tools ask for. Publish these on Pro pages.
        </p>
        <div className="mt-3 space-y-3">
          {Array.from({ length: faqCount }).map((_, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                name={`faq_question_${i}`}
                maxLength={180}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="FAQ question"
              />
              <input
                name={`faq_answer_${i}`}
                maxLength={600}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="Short answer"
              />
            </div>
          ))}
        </div>
        {faqCount < 5 && (
          <button
            type="button"
            onClick={() => setFaqCount((c) => c + 1)}
            className="mt-3 text-sm text-violet-700 hover:text-violet-800 font-medium"
          >
            + Add another FAQ
          </button>
        )}
      </section>

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
          Tip: include how you help customers and where you service so people and AI systems can understand your business clearly.
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
              <p className="text-sm font-semibold text-brand-800">
                🚀 Your page is live — now turn it into a verified lead engine
              </p>
              <p className="mt-1 text-xs text-brand-700/80">
                Add a lead profile, TrustBadge verification, tracked quote requests, instant alerts, and weekly proof reporting.
              </p>

              <div className="mt-4 space-y-3">
                <button
                  type="button"
                  onClick={handleStartProCheckout}
                  disabled={proCheckoutLoading}
                  className="w-full inline-flex items-center justify-center rounded-lg bg-brand-600 px-5 py-3 text-sm font-bold text-white hover:bg-brand-700 transition shadow-sm disabled:opacity-60"
                >
                  {proCheckoutLoading ? "Opening secure checkout..." : "Claim Founding 50 — Verified Lead Engine $49/mo"}
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={`/${createdSlug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                  >
                    View my page
                  </a>
                  <a
                    href={`/checkout/founding/${encodeURIComponent(createdSlug)}`}
                    className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                  >
                    See what&apos;s included
                  </a>
                </div>
              </div>

              {proCheckoutError && (
                <p className="mt-2 text-xs text-red-700">{proCheckoutError}</p>
              )}

              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50/60 p-3">
                <p className="text-xs font-bold text-amber-900">
                  🔥 Founding Member — $49/mo (first 50 businesses)
                </p>
                <p className="mt-1 text-xs text-amber-800">
                  Verified lead profile + TrustBadge + tracked enquiries + weekly proof summary. $149 setup waived for Founding 50.
                </p>
                <a
                  href={`/checkout/founding/${encodeURIComponent(createdSlug)}`}
                  className="mt-2 inline-block text-xs font-semibold text-amber-900 underline hover:text-amber-950"
                >
                  Claim your Founding 50 spot →
                </a>
              </div>
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
          : isPaidIntent
            ? `Create page & continue to ${isVerifiedLeadEngineIntent ? "Founding 50" : "Pro"} checkout`
            : "Create AI-readable business profile"}
      </button>

      {isPaidIntent && (
        <div className="rounded-xl border-2 border-sky-300 bg-sky-100 px-4 py-4 text-slate-900 shadow-sm">
          <p className="text-sm font-extrabold text-sky-950">
            {isVerifiedLeadEngineIntent ? "Verified Lead Engine includes:" : "Pro AI Presence includes:"}
          </p>
          <div className="mt-3 grid gap-2 text-sm leading-relaxed sm:grid-cols-2">
            {(isVerifiedLeadEngineIntent ? VERIFIED_LEAD_ENGINE_BENEFITS : PRO_AI_PRESENCE_BENEFITS).map((benefit) => (
              <p key={benefit} className="flex items-start gap-2">
                <span className="mt-0.5 font-bold text-sky-700">✓</span>
                <span>{benefit}</span>
              </p>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}
