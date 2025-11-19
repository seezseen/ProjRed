import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/client"
import { GridFSBucket, ObjectId } from "mongodb"

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid file ID" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()
    const bucket = new GridFSBucket(db, { bucketName: "uploads" })

    // Check if file exists
    const files = await bucket.find({ _id: new ObjectId(id) }).toArray()
    if (files.length === 0) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    const file = files[0]
    const downloadStream = bucket.openDownloadStream(new ObjectId(id))
    const chunks: Buffer[] = []

    return new Promise<NextResponse>((resolve) => {
      downloadStream.on("data", (chunk) => chunks.push(chunk))
      
      downloadStream.on("end", () => {
        const buffer = Buffer.concat(chunks)
        // Sanitize filename to only include ASCII characters
        const sanitizedFilename = file.filename.replace(/[^\x00-\x7F]/g, "_")
        
        const forceDownload = request.nextUrl.searchParams.get("download") === "1";
        const dispositionType = forceDownload ? "attachment" : "inline";

        // Increment download count only for explicit downloads
        if (forceDownload) {
          try {
            db.collection("reviewers").updateOne(
              { fileKey: id },
              { $inc: { downloadCount: 1 }, $set: { lastDownloadedAt: new Date() } }
            ).catch(() => {})
          } catch (_) {
            // Non-blocking: ignore metrics errors
          }
        }

        const response = new NextResponse(buffer, {
          status: 200,
          headers: {
            "Content-Type": file.metadata?.contentType || "application/pdf",
            "Content-Disposition": `${dispositionType}; filename="${sanitizedFilename}"`,
            "Content-Length": buffer.length.toString(),
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        })
        resolve(response)
      })
      
      downloadStream.on("error", (error) => {
        console.error("Error streaming file:", error)
        resolve(NextResponse.json({ error: "Failed to retrieve file" }, { status: 500 }))
      })
    })
  } catch (error) {
    console.error("Error retrieving file:", error)
    return NextResponse.json(
      { error: "Failed to retrieve file" },
      { status: 500 }
    )
  }
}
