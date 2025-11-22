import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import clientPromise from "@/lib/client"
import { uploadFile } from "@/lib/r2"

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function isAdmin(role?: string | null) {
  return role === 'admin' || role === 'founder'
}

const ACCEPTED = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    const role = (session?.user as any)?.role as string | undefined
    if (!isAdmin(role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }
    const status = request.nextUrl.searchParams.get('status') || 'pending'
    const client = await clientPromise
    const db = client.db()
    const col = db.collection('reviewer_requests')
    const docs = await col.find({ status }).sort({ createdAt: -1 }).toArray()
    return NextResponse.json({ requests: docs.map((d: any) => ({ ...d, _id: d._id.toString() })) })
  } catch (e) {
    console.error('GET reviewer-requests error', e)
    return NextResponse.json({ message: 'Failed to fetch requests' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const form = await request.formData()
    const file = form.get('file') as File | null
    const title = (form.get('title') as string | null)?.trim()
    const description = (form.get('description') as string | null)?.trim() || ''
    const subject = (form.get('subject') as string | null)?.trim()
    const gradeLevel = (form.get('gradeLevel') as string | null)?.trim()
    const author = (form.get('author') as string | null)?.trim() || ''
    const component = (form.get('component') as string | null)?.trim() as any
    const studentName = (form.get('studentName') as string | null)?.trim() || ''
    const studentSection = (form.get('studentSection') as string | null)?.trim() || ''

    if (!file || !title || !subject || !gradeLevel || !component) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    if (!ACCEPTED.includes(file.type)) {
      return NextResponse.json({ message: 'Only PDF and Word documents are accepted' }, { status: 415 })
    }

    if (!['Quiz','Midterms','Finals','Others'].includes(component)) {
      return NextResponse.json({ message: 'Invalid component' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const { fileId, filename } = await uploadFile(buffer, file.name, {
      contentType: file.type,
      uploadedBy: session.user.email,
      uploadedAt: new Date(),
    })

    const client = await clientPromise
    const db = client.db()
    const col = db.collection('reviewer_requests')
    const doc = {
      title,
      description,
      subject,
      gradeLevel,
      author,
      component,
      studentName,
      studentSection,
      fileName: filename,
      fileKey: fileId,
      fileSize: (file as any).size ?? buffer.length,
      uploadedBy: session.user.email,
      status: 'pending',
      createdAt: new Date(),
    }
    const res = await col.insertOne(doc)
    return NextResponse.json({ message: 'Request submitted', requestId: res.insertedId.toString() }, { status: 201 })
  } catch (e) {
    console.error('POST reviewer-requests error', e)
    return NextResponse.json({ message: 'Failed to submit request' }, { status: 500 })
  }
}
