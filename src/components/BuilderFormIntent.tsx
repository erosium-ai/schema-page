"use client";

import { useSearchParams } from "next/navigation";
import BuilderForm from "@/components/BuilderForm";

export default function BuilderFormIntent() {
  const searchParams = useSearchParams();
  const intent = searchParams.get("intent") === "pro" ? "pro" : "free";

  return <BuilderForm intent={intent} />;
}
