// Load environment variables FIRST, before any other imports
import { config } from "dotenv"
import { resolve } from "path"
config({ path: resolve(process.cwd(), ".env.local") })

// Now import MongoDB client and bcrypt
import { MongoClient } from "mongodb"
import bcrypt from "bcryptjs"

/**
 * Seed script to create the default founder account
 * Run this script once to initialize the system with a founder account
 * 
 * Default Credentials:
 * - Username: founder
 * - Email: founder@example.com
 * - Password: founder123
 * - Role: founder
 * 
 * IMPORTANT: Change the password after first login!
 */

const DEFAULT_FOUNDER = {
  name: "System Founder",
  username: "founder",
  email: "founder@example.com",
  password: "founder123",
  role: "founder" as const,
}

async function seedFounder() {
  let client: MongoClient | null = null
  
  try {
    console.log("🌱 Starting founder account seed...")

    const uri = process.env.MONGODB_URI
    if (!uri) {
      throw new Error('MONGODB_URI not found in environment variables')
    }

    client = new MongoClient(uri)
    await client.connect()
    const db = client.db()
    const users = db.collection("users")

    // Check if founder already exists
    const existingFounder = await users.findOne({
      $or: [
        { email: DEFAULT_FOUNDER.email },
        { username: DEFAULT_FOUNDER.username },
        { role: "founder" },
      ],
    })

    if (existingFounder) {
      console.log("⚠️  A founder account already exists!")
      console.log(`   Email: ${existingFounder.email}`)
      console.log(`   Username: ${existingFounder.username || "N/A"}`)
      console.log("\n   If you've forgotten your credentials, you'll need to reset them manually in the database.")
      return
    }

    // Hash the default password
    const hashedPassword = await bcrypt.hash(DEFAULT_FOUNDER.password, 10)

    // Create the founder account
    const result = await users.insertOne({
      name: DEFAULT_FOUNDER.name,
      username: DEFAULT_FOUNDER.username,
      email: DEFAULT_FOUNDER.email,
      password: hashedPassword,
      role: DEFAULT_FOUNDER.role,
      createdAt: new Date(),
    })

    if (result.acknowledged) {
      console.log("✅ Founder account created successfully!\n")
      console.log("📋 Default Login Credentials:")
      console.log("   ────────────────────────────")
      console.log(`   Username: ${DEFAULT_FOUNDER.username}`)
      console.log(`   Email:    ${DEFAULT_FOUNDER.email}`)
      console.log(`   Password: ${DEFAULT_FOUNDER.password}`)
      console.log("   ────────────────────────────\n")
      console.log("⚠️  SECURITY NOTICE:")
      console.log("   Please change your password immediately after first login!")
      console.log("   Go to: Profile → Settings → Change Password\n")
    } else {
      console.error("❌ Failed to create founder account")
    }
  } catch (error) {
    console.error("❌ Error seeding founder account:", error)
    throw error
  } finally {
    if (client) {
      await client.close()
    }
    process.exit(0)
  }
}

// Run the seed function
seedFounder()
