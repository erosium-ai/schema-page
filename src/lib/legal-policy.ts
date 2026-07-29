/* 🔑 Keywords: Credentials AI legal policy versions, checkout acceptance evidence, Terms Privacy Refund Cancellation policy IDs */

export const LEGAL_POLICY_VERSIONS = {
  terms: "terms-2026-07-29.v2",
  privacy: "privacy-2026-07-29.v2",
  refunds: "refunds-2026-07-29.v2",
} as const;

export type LegalPolicyVersions = typeof LEGAL_POLICY_VERSIONS;

export function isCurrentLegalPolicyVersions(
  value: unknown
): value is LegalPolicyVersions {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;

  return (
    record.terms === LEGAL_POLICY_VERSIONS.terms &&
    record.privacy === LEGAL_POLICY_VERSIONS.privacy &&
    record.refunds === LEGAL_POLICY_VERSIONS.refunds
  );
}
