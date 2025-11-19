import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import clientPromise from "@/lib/client"
import { ObjectId } from "mongodb"
import { deleteFile } from "@/lib/r2"

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function isAdminRole(role?: string | null) {
  return role === "admin" || role === "founder"
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const role = (session?.user as any)?.role as string | undefined
    if (!isAdminRole(role)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const { id } = await context.params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()
    const col = db.collection("pointers")

    const existing = await col.findOne({ _id: new ObjectId(id) })
    if (!existing) {
      return NextResponse.json({ message: "Not found" }, { status: 404 })
    }

    await col.deleteOne({ _id: new ObjectId(id) })

    if ((existing as any).fileKey) {
      try {
        await deleteFile((existing as any).fileKey)
      } catch (e) {
        // non-blocking
        console.warn("Failed to delete file for pointer", id)
      }
    }

    return NextResponse.json({ message: "Deleted" })
  } catch (error) {
    console.error("Pointers DELETE error:", error)
    return NextResponse.json({ message: "Failed to delete" }, { status: 500 })
  }
}
