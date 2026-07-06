"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";

interface UpgradeButtonProps {
  slug: string;
}

export default function UpgradeButton({ slug }: UpgradeButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpgrade = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.url) {
        setError(data.error || "Unable to start checkout. Please try again.");
        return;
      }

      window.location.href = data.url;
    } catch (err) {
      setError((err as Error).message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleUpgrade}
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 text-base font-semibold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl shadow-md transition"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Sparkles className="h-5 w-5" />
        )}
        {loading ? "Opening checkout..." : "Upgrade to Pro — $29"}
      </button>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
