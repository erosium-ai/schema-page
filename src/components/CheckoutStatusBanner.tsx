"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { X } from "lucide-react";

const AUTO_HIDE_MS = 8000;

export default function CheckoutStatusBanner() {
  const searchParams = useSearchParams();
  const checkout = searchParams.get("checkout");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (checkout === "success" || checkout === "cancelled") {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), AUTO_HIDE_MS);
      return () => clearTimeout(timer);
    }
  }, [checkout]);

  if (!visible || (checkout !== "success" && checkout !== "cancelled")) {
    return null;
  }

  const isSuccess = checkout === "success";
  const plan = searchParams.get("plan");
  const successMessage =
    plan === "founding"
      ? "Payment successful! Your AI-Ready Business Page subscription is active. It may take a few seconds to update."
      : "Payment successful! Your subscription is active. It may take a few seconds to update.";

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md ${
        isSuccess
          ? "bg-green-50 border-green-200 text-green-800"
          : "bg-amber-50 border-amber-200 text-amber-800"
      } border rounded-xl shadow-lg px-4 py-3 flex items-start gap-3`}
      role="status"
      aria-live="polite"
    >
      <span className="text-lg" aria-hidden="true">
        {isSuccess ? "🎉" : "⚠️"}
      </span>
      <p className="text-sm font-medium flex-1">
        {isSuccess ? successMessage : "Payment cancelled — no charge. Try again anytime."}
      </p>
      <button
        onClick={() => setVisible(false)}
        className={`shrink-0 p-1 rounded-md transition ${
          isSuccess
            ? "text-green-700 hover:bg-green-100"
            : "text-amber-700 hover:bg-amber-100"
        }`}
        aria-label="Close banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
