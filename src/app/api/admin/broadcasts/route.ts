import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createBroadcast, getBroadcasts } from "@/lib/broadcasts";
import { CreateBroadcastInput } from "@/app/types/broadcast";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any)?.role;
    if (userRole !== "admin" && userRole !== "founder") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const broadcasts = await getBroadcasts();
    return NextResponse.json({ broadcasts });
  } catch (error) {
    console.error("Error in GET /api/admin/broadcasts:", error);
    return NextResponse.json(
      { error: "Failed to fetch broadcasts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as any)?.role;
    if (userRole !== "admin" && userRole !== "founder") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const input: CreateBroadcastInput = {
      title: body.title,
      message: body.message,
      type: body.type,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
      dismissible: body.dismissible ?? true,
    };

    if (!input.title || !input.message || !input.type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const createdBy = session.user.name || session.user.email || "Unknown";
    const broadcast = await createBroadcast(input, createdBy);

    if (!broadcast) {
      return NextResponse.json(
        { error: "Failed to create broadcast" },
        { status: 500 }
      );
    }

    return NextResponse.json({ broadcast }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/admin/broadcasts:", error);
    return NextResponse.json(
      { error: "Failed to create broadcast" },
      { status: 500 }
    );
  }
}
