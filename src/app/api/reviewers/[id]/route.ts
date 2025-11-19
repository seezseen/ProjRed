import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import clientPromise from "@/lib/client"
import { ObjectId } from "mongodb"
import { deleteFile } from "@/lib/r2"

export const dynamic = 'force-dynamic'

// DELETE reviewer by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userRole = (session.user as any)?.role
    if (userRole !== "admin" && userRole !== "founder") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id } = await params
    const client = await clientPromise
    const db = client.db()
    const reviewers = db.collection("reviewers")

    // Get reviewer to find fileKey
    const reviewer = await reviewers.findOne({ _id: new ObjectId(id) })
    
    if (!reviewer) {
      return NextResponse.json({ error: "Reviewer not found" }, { status: 404 })
    }

    // Delete the file from GridFS
    if (reviewer.fileKey) {
      try {
        await deleteFile(reviewer.fileKey)
      } catch (error) {
        console.error("Error deleting file from GridFS:", error)
      }
    }

    // Delete reviewer metadata from database
    await reviewers.deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ message: "Reviewer deleted successfully" })
  } catch (error) {
    console.error("Error deleting reviewer:", error)
    return NextResponse.json(
      { error: "Failed to delete reviewer" },
      { status: 500 }
    )
  }
}
