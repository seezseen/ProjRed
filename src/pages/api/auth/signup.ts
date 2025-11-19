import { NextApiRequest, NextApiResponse } from "next"
import { createUser, getUserByEmail, getUserByUsername } from "@/lib/users"
import bcrypt from "bcryptjs"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { name, username, email, password } = req.body

  if (!name || !username || !email || !password) {
    return res.status(400).json({ message: "Missing fields" })
  }

  const existingUser = await getUserByEmail(email)

  if (existingUser) {
    return res.status(409).json({ message: "User with this email already exists" })
  }

  const existingUsername = await getUserByUsername(username)

  if (existingUsername) {
    return res.status(409).json({ message: "User with this username already exists" })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser = await createUser({
    name,
    email,
    username,
    password: hashedPassword,
    role: "student",
  })

  res.status(201).json(newUser)
}
