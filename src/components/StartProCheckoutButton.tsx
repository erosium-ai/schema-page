"use client";

import { useState } from "react";

interface StartProCheckoutButtonProps {
  slug: string;
  plan?: "pro" | "verified_lead_engine";
  billingCycle?: "monthly" | "weekly";
  label?: string;
  variant?: "primary" | "secondary";
}

export default function StartProCheckoutButton({
  slug,
  plan = "pro",
  billingCycle = "monthly",
  label = "Continue to secure payment",
  variant = "primary",
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
        body: JSON.stringify({ slug, plan, billingCycle }),
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
        className={
          variant === "secondary"
            ? "inline-flex w-full items-center justify-center rounded-xl border border-slate-600/70 bg-slate-950/70 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-300 hover:bg-slate-900 disabled:opacity-60"
            : "inline-flex w-full items-center justify-center rounded-xl bg-cyan-400 px-5 py-3 text-sm font-extrabold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-60"
        }
      >
        {loading ? "Opening secure payment..." : label}
      </button>

      {error && <p className="text-xs text-red-700">{error}</p>}
    </div>
  );
}
