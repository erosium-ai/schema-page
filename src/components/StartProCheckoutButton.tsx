"use client";

import { useState } from "react";

interface StartProCheckoutButtonProps {
  slug: string;
  plan?: "pro" | "verified_lead_engine";
  label?: string;
}

export default function StartProCheckoutButton({
  slug,
  plan = "pro",
  label = "Continue to secure payment",
}: StartProCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, plan }),
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.url) {
        setError(data.error || "Unable to start checkout. Please try again.");
        return;
      }

      window.location.href = data.url;
    } catch (err) {
      setError((err as Error).message || "Unable to start checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleContinue}
        disabled={loading}
        className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
      >
        {loading ? "Opening secure payment..." : label}
      </button>

      {error && <p className="text-xs text-red-700">{error}</p>}
    </div>
  );
}
