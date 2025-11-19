import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getUsers } from "@/lib/users"
import clientPromise from "@/lib/client"
import bcrypt from "bcryptjs"

export const dynamic = 'force-dynamic'

// GET all users (admin/founder only)
export async function GET() {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userRole = (session.user as any)?.role
    if (userRole !== "admin" && userRole !== "founder") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { users, error } = await getUsers()

    if (error) {
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}

// POST create new admin user (founder only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userRole = (session.user as any)?.role
    if (userRole !== "founder") {
      return NextResponse.json({ error: "Forbidden - Founder only" }, { status: 403 })
    }

    const body = await request.json()
    const { name, username, email, password, role } = body

    if (!name || !username || !email || !password || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    if (role !== "admin" && role !== "founder") {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db()
    const users = db.collection("users")

    // Check if user already exists (email or username)
    const existingUser = await users.findOne({ 
      $or: [{ email }, { username }] 
    })
    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 400 }
        )
      }
      if (existingUser.username === username) {
        return NextResponse.json(
          { error: "User with this username already exists" },
          { status: 400 }
        )
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const result = await users.insertOne({
      name,
      username,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date(),
    })

    return NextResponse.json({
      message: "Admin created successfully",
      userId: result.insertedId,
    })
  } catch (error) {
    console.error("Error creating admin:", error)
    return NextResponse.json(
      { error: "Failed to create admin" },
      { status: 500 }
    )
  }
}
