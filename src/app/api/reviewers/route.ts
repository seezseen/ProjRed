import { NextRequest, NextResponse } from "next/server";
import { createReviewer, getReviewers } from "@/lib/reviewers";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const { reviewers, error } = await getReviewers();
    
    if (error) {
      return NextResponse.json({ message: error }, { status: 500 });
    }
    
    return NextResponse.json({ reviewers: reviewers || [] });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch reviewers" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    const body = await request.json();
    const { title, description, subject, gradeLevel, fileKey, fileName, fileSize } = body;
    
    if (!title || !description || !subject || !gradeLevel || !fileKey || !fileName) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }
    
    const { reviewer, error } = await createReviewer({
      title,
      description,
      subject,
      gradeLevel: gradeLevel.toString(),
      fileKey,
      fileName,
      fileSize: fileSize || 0,
      uploadedBy: session.user?.email || "anonymous",
    });
    
    if (error) {
      return NextResponse.json({ message: error }, { status: 500 });
    }
    
    return NextResponse.json(reviewer, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create reviewer" },
      { status: 500 }
    );
  }
}
