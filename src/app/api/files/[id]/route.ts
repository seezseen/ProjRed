import { NextRequest, NextResponse } from "next/server"
import { getGridFSBucket } from "@/lib/r2"
import { ObjectId } from "mongodb"

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid file ID" }, { status: 400 })
    }

    const bucket = await getGridFSBucket()
    const downloadStream = bucket.openDownloadStream(new ObjectId(id))

    // Get file metadata
    const files = await bucket.find({ _id: new ObjectId(id) }).toArray()
    if (files.length === 0) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    const file = files[0]
    const chunks: Buffer[] = []

    return new Promise<NextResponse>((resolve, reject) => {
      downloadStream.on("data", (chunk) => chunks.push(chunk))
      
      downloadStream.on("end", () => {
        const buffer = Buffer.concat(chunks)
        const response = new NextResponse(buffer, {
          status: 200,
          headers: {
            "Content-Type": file.contentType || "application/pdf",
            "Content-Disposition": `inline; filename="${file.filename}"`,
            "Content-Length": buffer.length.toString(),
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
