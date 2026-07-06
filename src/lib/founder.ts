export function isDemoAllowlistEnabled(): boolean {
  return Boolean(process.env.FOUNDER_DEMO_ALLOWLIST);
}
