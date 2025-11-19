import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { toggleFavorite } from "@/lib/users";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { reviewerId } = await request.json();
    if (!reviewerId) {
      return NextResponse.json({ message: "Missing reviewerId" }, { status: 400 });
    }
    const { favorites, favored, error } = await toggleFavorite(session.user.email, reviewerId);
    if (error) return NextResponse.json({ message: error }, { status: 500 });
    return NextResponse.json({ favorites, favored });
  } catch (e) {
    return NextResponse.json({ message: "Failed to update favorites" }, { status: 500 });
  }
}
