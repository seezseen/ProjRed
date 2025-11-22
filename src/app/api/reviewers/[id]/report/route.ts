import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/client";
import { ObjectId } from "mongodb";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { reason, details } = await request.json();
    if (!reason) return NextResponse.json({ message: "Missing reason" }, { status: 400 });
    const client = await clientPromise;
    const db = client.db();
    const reports = db.collection("reports");
    const doc = {
      reviewerId: new ObjectId((await params).id),
      reason,
      details: details || "",
      createdAt: new Date(),
    };
    await reports.insertOne(doc);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ message: "Failed to submit report" }, { status: 500 });
  }
}
