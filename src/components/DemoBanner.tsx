"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function DemoBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-yellow-100 border-b border-yellow-200">
      <div className="max-w-3xl mx-auto px-4 py-2 flex items-center justify-between text-sm text-yellow-900">
        <span>
          <span className="font-semibold">Demo Mode</span> — This is a sample page.
        </span>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 hover:bg-yellow-200 rounded"
          aria-label="Dismiss demo banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
