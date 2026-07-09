// 🔑 Keywords: Credentials AI founder notify, Resend, checkout safety net, new founding member alert
// Safety-net notifier for the SchemaPage → Credentials AI checkout flow.
// If Resend is configured, emails the founder when a new paid checkout lands.
// If not configured, falls back to structured console logs so nothing is lost.

interface NewFoundingMemberPayload {
  slug: string;
  businessName?: string | null;
  paymentEmail?: string | null;
  customerId?: string | null;
  subscriptionId?: string | null;
  sessionId?: string | null;
  amountAud?: number | null;
  plan?: string | null;
}

function safeString(value: unknown): string {
  if (value === null || value === undefined) return "—";
  return String(value);
}

function buildFounderEmailHtml(p: NewFoundingMemberPayload): string {
  const amountLine =
    typeof p.amountAud === "number"
      ? `$${(p.amountAud / 100).toFixed(2)} AUD`
      : "—";
  return `
<div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;line-height:1.5;color:#111">
  <h2 style="margin:0 0 12px 0">New Founding Member landed 🎉</h2>
  <p>A Credentials AI Founding 50 checkout just completed. Follow up with a personal welcome within one business day.</p>
  <table style="border-collapse:collapse;margin-top:12px">
    <tbody>
      <tr><td style="padding:4px 12px 4px 0;color:#666">Business</td><td>${safeString(p.businessName)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666">Slug</td><td>${safeString(p.slug)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666">Payment email</td><td>${safeString(p.paymentEmail)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666">Plan</td><td>${safeString(p.plan)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666">Amount</td><td>${amountLine}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666">Stripe customer</td><td>${safeString(p.customerId)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666">Stripe subscription</td><td>${safeString(p.subscriptionId)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666">Session</td><td>${safeString(p.sessionId)}</td></tr>
    </tbody>
  </table>
  <p style="margin-top:16px">
    Profile: <a href="https://credentialsai.com.au/b/${encodeURIComponent(p.slug)}">credentialsai.com.au/b/${safeString(p.slug)}</a><br />
    Admin leads: <a href="https://credentialsai.com.au/admin/leads">credentialsai.com.au/admin/leads</a>
  </p>
  <p style="margin-top:16px;color:#666;font-size:12px">Sent by the SchemaPage checkout webhook.</p>
</div>
`.trim();
}

function buildFounderEmailText(p: NewFoundingMemberPayload): string {
  const amountLine =
    typeof p.amountAud === "number"
      ? `$${(p.amountAud / 100).toFixed(2)} AUD`
      : "—";
  return [
    "New Founding Member landed",
    "",
    `Business: ${safeString(p.businessName)}`,
    `Slug: ${safeString(p.slug)}`,
    `Payment email: ${safeString(p.paymentEmail)}`,
    `Plan: ${safeString(p.plan)}`,
    `Amount: ${amountLine}`,
    `Stripe customer: ${safeString(p.customerId)}`,
    `Stripe subscription: ${safeString(p.subscriptionId)}`,
    `Session: ${safeString(p.sessionId)}`,
    "",
    `Profile: https://credentialsai.com.au/b/${safeString(p.slug)}`,
    `Admin leads: https://credentialsai.com.au/admin/leads`,
  ].join("\n");
}

export async function notifyFounderNewMember(
  payload: NewFoundingMemberPayload
): Promise<{ delivered: boolean; provider: "resend" | "console"; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const toAddress = process.env.FOUNDER_NOTIFY_EMAIL || "beastlytechgc@gmail.com";
  const fromAddress =
    process.env.FOUNDER_NOTIFY_FROM || "Credentials AI <notifications@erosium.com.au>";

  if (!apiKey) {
    console.info("[credentials-ai][founder-notify] no RESEND_API_KEY — logging payload", {
      to: toAddress,
      from: fromAddress,
      ...payload,
    });
    return { delivered: false, provider: "console" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        // Cloudflare in front of Resend blocks the default Node fetch UA in some regions.
        "User-Agent": "credentials-ai-checkout/1.0 (schemapage)",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [toAddress],
        subject: `New Founding Member: ${payload.businessName || payload.slug}`,
        html: buildFounderEmailHtml(payload),
        text: buildFounderEmailText(payload),
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.warn("[credentials-ai][founder-notify] Resend non-2xx", {
        status: res.status,
        body: body.slice(0, 300),
      });
      return {
        delivered: false,
        provider: "resend",
        error: `resend_status_${res.status}`,
      };
    }

    return { delivered: true, provider: "resend" };
  } catch (err) {
    console.warn("[credentials-ai][founder-notify] Resend threw", err);
    return {
      delivered: false,
      provider: "resend",
      error: (err as Error).message,
    };
  }
}
