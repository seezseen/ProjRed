import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import clientPromise from "@/lib/client";
import { uploadFile } from "@/lib/r2";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function isAdminRole(role?: string | null) {
  return role === "admin" || role === "founder";
}

export async function GET(request: NextRequest) {
  try {
    // Public listing for students; optional filters
    const grade = request.nextUrl.searchParams.get("grade") || undefined;
    const limitParam = request.nextUrl.searchParams.get("limit");
    const limit = Math.min(Math.max(parseInt(limitParam || "0", 10) || 0, 0), 60) || undefined;

    const client = await clientPromise;
    const db = client.db();
    const col = db.collection("pointers");

    const filter: any = {};
    if (grade) filter.gradeLevel = grade;

    let cursor = col.find(filter).sort({ createdAt: -1 });
    if (limit) cursor = cursor.limit(limit);
    const docs = await cursor.toArray();

    const pointers = docs.map((d: any) => ({ ...d, _id: d._id.toString() }));
    return NextResponse.json({ pointers });
  } catch (error) {
    console.error("Pointers GET error:", error);
    return NextResponse.json({ message: "Failed to fetch pointers" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role as string | undefined;
    if (!isAdminRole(role)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = (formData.get("title") as string | null)?.trim();
    const description = (formData.get("description") as string | null)?.trim() || "";
    const teacher = (formData.get("teacher") as string | null)?.trim() || "";
    const subject = (formData.get("subject") as string | null)?.trim();
    const gradeLevel = (formData.get("gradeLevel") as string | null)?.trim();

    if (!file || !title || !subject || !gradeLevel) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const allowed = ["image/png", "image/jpeg"]; // jpeg covers .jpg and .jpeg
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ message: "Only PNG and JPG images are allowed" }, { status: 415 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { fileId, filename } = await uploadFile(buffer, file.name, {
      contentType: file.type,
      uploadedBy: session?.user?.email,
      uploadedAt: new Date(),
    });

    const client = await clientPromise;
    const db = client.db();
    const col = db.collection("pointers");

    const doc = {
      title,
      description,
      subject,
      teacher,
      gradeLevel,
      fileName: filename,
      fileKey: fileId,
      fileSize: (file as any).size ?? buffer.length,
      uploadedBy: session?.user?.email,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const res = await col.insertOne(doc);
    return NextResponse.json({ message: "Pointer uploaded", pointerId: res.insertedId.toString() }, { status: 201 });
  } catch (error) {
    console.error("Pointers POST error:", error);
    return NextResponse.json({ message: "Failed to upload pointer" }, { status: 500 });
  }
}
