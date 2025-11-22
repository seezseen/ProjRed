import { NextRequest, NextResponse } from "next/server";
import { incrementHelpful } from "@/lib/reviewers";

export const dynamic = 'force-dynamic';

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { reviewer, error } = await incrementHelpful(id);
    if (error) return NextResponse.json({ message: error }, { status: 500 });
    return NextResponse.json({ reviewer });
  } catch (e) {
    return NextResponse.json({ message: "Failed to update" }, { status: 500 });
  }
}
