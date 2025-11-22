import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import clientPromise from "@/lib/client"
import { ObjectId } from "mongodb"
import { deleteFile } from "@/lib/r2"

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function isAdmin(role?: string | null) { return role === 'admin' || role === 'founder' }

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const role = (session?.user as any)?.role as string | undefined
    if (!isAdmin(role)) return NextResponse.json({ message: 'Forbidden' }, { status: 403 })

    const { id } = await context.params
    if (!ObjectId.isValid(id)) return NextResponse.json({ message: 'Invalid ID' }, { status: 400 })

    const client = await clientPromise
    const db = client.db()
    const reqCol = db.collection('reviewer_requests')
    const reqDoc: any = await reqCol.findOne({ _id: new ObjectId(id) })
    if (!reqDoc) return NextResponse.json({ message: 'Not found' }, { status: 404 })

    if (reqDoc.fileKey) {
      try { await deleteFile(reqDoc.fileKey) } catch {}
    }
    await reqCol.deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ message: 'Rejected and removed' })
  } catch (e) {
    console.error('Reject error', e)
    return NextResponse.json({ message: 'Failed to reject' }, { status: 500 })
  }
}
