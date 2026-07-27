import { NextRequest, NextResponse } from "next/server";
import { verifyAbn } from "@/lib/abn";

/**
 * POST /api/abn/verify
 *
 * Body: { abn: string, business_name?: string }
 *
 * Pings the Australian Business Register API (using the ABR_GUID env var)
 * and returns a verification result. Called by the builder form when the
 * user types an ABN.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const abn = String(body?.abn || "").trim();
    const businessName = String(body?.business_name || "").trim() || undefined;

    if (!abn) {
      return NextResponse.json(
        { success: false, error: "abn is required" },
        { status: 400 }
      );
    }

    const result = await verifyAbn(abn, businessName);
    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message || "ABN verification failed" },
      { status: 500 }
    );
  }
}
