"use client";

import { useSearchParams } from "next/navigation";
import BuilderForm from "@/components/BuilderForm";

export default function BuilderFormIntent() {
  const searchParams = useSearchParams();
  const rawIntent = searchParams.get("intent");
  const intent =
    rawIntent === "verified_lead_engine" || rawIntent === "founding" || rawIntent === "founder_bundle"
      ? "verified_lead_engine"
      : rawIntent === "pro"
        ? "pro"
        : "free";

  return <BuilderForm intent={intent} />;
}
