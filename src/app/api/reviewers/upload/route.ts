import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { uploadFile } from "@/lib/r2"
import clientPromise from "@/lib/client"

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userRole = (session.user as any)?.role
    if (userRole !== "admin" && userRole !== "founder") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const subject = formData.get("subject") as string
    const gradeLevel = formData.get("gradeLevel") as string
    const tagsStr = (formData.get("tags") as string) || ""
    const difficulty = (formData.get("difficulty") as string) || ""

    if (!file || !title || !description || !subject || !gradeLevel) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload file to MongoDB GridFS
    const { fileId, filename } = await uploadFile(buffer, file.name, {
      contentType: file.type,
      uploadedBy: session.user.email,
      uploadedAt: new Date(),
    })

    // Save reviewer metadata to database
    const client = await clientPromise
    const db = client.db()
    const reviewers = db.collection("reviewers")

    const parsedTags = tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t)
      .slice(0, 12)

    const result = await reviewers.insertOne({
      title,
      description,
      subject,
      gradeLevel,
      fileName: filename,
      fileKey: fileId,
      fileSize: file.size,
      uploadedBy: session.user.email,
      createdAt: new Date(),
      tags: parsedTags,
      difficulty: ["easy","medium","hard"].includes(difficulty) ? difficulty : undefined,
    })

    return NextResponse.json({
      message: "Reviewer uploaded successfully",
      reviewerId: result.insertedId,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { message: "Failed to upload reviewer" },
      { status: 500 }
    )
  }
}
