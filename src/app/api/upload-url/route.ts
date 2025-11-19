import { NextRequest, NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    const body = await request.json();
    const { fileName, fileType } = body;
    
    if (!fileName || !fileType) {
      return NextResponse.json(
        { message: "Missing fileName or fileType" },
        { status: 400 }
      );
    }
    
    const fileKey = `${Date.now()}-${fileName}`;
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: fileKey,
      ContentType: fileType,
    });
    
    const uploadUrl = await getSignedUrl(R2, command, { expiresIn: 3600 });
    
    return NextResponse.json({ uploadUrl, fileKey });
  } catch (error) {
    console.error("Upload URL generation error:", error);
    return NextResponse.json(
      { message: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
