import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = body.token || request.headers.get("authorization")?.replace("Bearer ", "");
    const expectedToken = process.env.CREDENTIALS_AI_HEALTHCHECK_TOKEN;

    if (!expectedToken || token !== expectedToken) {
      return NextResponse.json({ revalidated: false, message: "Unauthorized" }, { status: 401 });
    }

    const path = body.path;
    if (typeof path !== "string" || !path.startsWith("/")) {
      return NextResponse.json({ revalidated: false, message: "Invalid path" }, { status: 400 });
    }

    revalidatePath(path);
    return NextResponse.json({ revalidated: true, now: Date.now(), path });
  } catch {
    return NextResponse.json({ revalidated: false, message: "Error" }, { status: 500 });
  }
}
