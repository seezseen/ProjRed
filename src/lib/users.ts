import clientPromise from "./client"
import { User } from "@/app/types"
import { ObjectId } from "mongodb"

let db: any
let users: any

async function init() {
  if (db) return
  
  // Runtime validation
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured. Please add it to your .env.local file.');
  }
  
  try {
    const client = await clientPromise
    db = client.db()
    users = db.collection("users")
  } catch (error) {
    throw new Error("Failed to connect to the database. Please check your MONGODB_URI.")
  }
}

// Don't initialize during build time
if (process.env.NODE_ENV !== 'production' || process.env.MONGODB_URI) {
  (async () => {
    try {
      await init()
    } catch (error) {
      // Silently fail during build if no MongoDB URI
      console.error('Database initialization skipped:', error);
    }
  })()
}

export async function getUsers() {
  try {
    if (!users) await init()
    const result = await users.find({}).map((user: User) => ({ ...user, _id: user._id.toString() })).toArray()
    return { users: result }
  } catch (error) {
    return { error: "Failed to fetch users." }
  }
}

export async function getUserByEmail(email: string) {
  try {
    if (!users) await init()
    const user = await users.findOne({ email })
    if (!user) return null
    return { ...user, _id: user._id.toString() }
  } catch (error) {
    return { error: "Failed to fetch user." }
  }
}

export async function getUserByUsername(username: string) {
  try {
    if (!users) await init()
    const user = await users.findOne({ username })
    if (!user) return null
    return { ...user, _id: user._id.toString() }
  } catch (error) {
    return { error: "Failed to fetch user." }
  }
}

export async function getUserByEmailOrUsername(emailOrUsername: string) {
  try {
    if (!users) await init()
    const user = await users.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    })
    if (!user) return null
    return { ...user, _id: user._id.toString() }
  } catch (error) {
    return { error: "Failed to fetch user." }
  }
}

export async function createUser(user: Omit<User, "_id">) {
  try {
    if (!users) await init()
    const result = await users.insertOne(user)
    return { user: { ...user, _id: result.insertedId.toString() } }
  } catch (error) {
    return { error: "Failed to create user." }
  }
}

export async function toggleFavorite(userEmail: string, reviewerId: string) {
  try {
    if (!users) await init();
    const res = await users.findOne({ email: userEmail });
    if (!res) return { error: "User not found" };
    const has = Array.isArray(res.favorites) && res.favorites.includes(reviewerId);
    const update = has ? { $pull: { favorites: reviewerId } } : { $addToSet: { favorites: reviewerId } };
    const upd = await users.findOneAndUpdate({ email: userEmail }, update, { returnDocument: "after" });
    const doc = upd.value as User;
    return { favorites: doc?.favorites || [], favored: !has };
  } catch (error) {
    return { error: "Failed to update favorites." };
  }
}
