import { NextRequest, NextResponse } from "next/server";
import { searchReviewers } from "@/lib/reviewers";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams.get("q") || "";
    const { reviewers, error } = await searchReviewers(q);
    if (error) return NextResponse.json({ message: error }, { status: 500 });
    return NextResponse.json({ reviewers: reviewers || [] });
  } catch (e) {
    return NextResponse.json({ message: "Search failed" }, { status: 500 });
  }
}
