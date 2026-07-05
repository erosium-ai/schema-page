"use client";

import { useState } from "react";
import { PageData, ServiceItem } from "@/lib/types";

interface BuilderFormProps {
  onPageCreated?: (page: PageData) => void;
}

export default function BuilderForm({ onPageCreated }: BuilderFormProps) {
  const [serviceCount, setServiceCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

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
      slug: (formData.get("slug") as string).trim().toLowerCase().replace(/\s+/g, "-"),
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
      onPageCreated?.(result.data);
      form.reset();
      setServiceCount(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Business Name *</label>
          <input
            name="business_name"
            required
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="Acme Corp"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Page Slug *</label>
          <input
            name="slug"
            required
            pattern="[a-z0-9-]+"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="acme-corp"
          />
          <p className="text-xs text-gray-500 mt-1">yoursite.com/acme-corp</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tagline</label>
        <input
          name="tagline"
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
          placeholder="We make the best widgets"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          rows={3}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
          placeholder="Tell visitors what you do..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Services</label>
        <div className="space-y-3">
          {Array.from({ length: serviceCount }).map((_, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                name={`service_name_${i}`}
                placeholder="Service name"
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <input
                name={`service_price_${i}`}
                placeholder="Price"
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <input
                name={`service_desc_${i}`}
                placeholder="Short description"
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
        <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">
          Page created! Your AI-Agent Friendly page is live.
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create AI-Agent Readable Page"}
      </button>
    </form>
  );
}
