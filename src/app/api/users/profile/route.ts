import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import clientPromise from "@/lib/client"

export const dynamic = 'force-dynamic'

// PUT update user profile
export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, email } = body

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db()
    const users = db.collection("users")

    const userEmail = session.user.email
    if (!userEmail) {
      return NextResponse.json({ error: "User email not found" }, { status: 400 })
    }

    // Check if new email is already taken by another user
    if (email !== userEmail) {
      const existingUser = await users.findOne({ email })
      if (existingUser) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 }
        )
      }
    }

    const result = await users.updateOne(
      { email: userEmail },
      { $set: { name, email, updatedAt: new Date() } }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Profile updated successfully" })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    )
  }
}
