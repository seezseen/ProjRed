import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import clientPromise from "@/lib/client"
import { ObjectId } from "mongodb"

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
    const revCol = db.collection('reviewers')

    const reqDoc = await reqCol.findOne({ _id: new ObjectId(id), status: 'pending' })
    if (!reqDoc) return NextResponse.json({ message: 'Request not found or already processed' }, { status: 404 })

    const reviewer = {
      title: reqDoc.title,
      description: reqDoc.description,
      subject: reqDoc.subject,
      gradeLevel: reqDoc.gradeLevel,
      fileName: reqDoc.fileName,
      fileKey: reqDoc.fileKey,
      fileSize: reqDoc.fileSize,
      uploadedBy: reqDoc.uploadedBy,
      createdAt: new Date(),
      author: reqDoc.author,
      component: reqDoc.component,
    }

    const ins = await revCol.insertOne(reviewer)
    await reqCol.updateOne({ _id: new ObjectId(id) }, { $set: { status: 'approved', reviewerId: ins.insertedId.toString() } })

    return NextResponse.json({ message: 'Approved', reviewerId: ins.insertedId.toString() })
  } catch (e) {
    console.error('Approve error', e)
    return NextResponse.json({ message: 'Failed to approve' }, { status: 500 })
  }
}
