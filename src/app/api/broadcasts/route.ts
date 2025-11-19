import { NextRequest, NextResponse } from "next/server";
import { getActiveBroadcasts } from "@/lib/broadcasts";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const broadcasts = await getActiveBroadcasts();
    return NextResponse.json({ broadcasts });
  } catch (error) {
    console.error("Error in GET /api/broadcasts:", error);
    return NextResponse.json(
      { error: "Failed to fetch broadcasts" },
      { status: 500 }
    );
  }
}
