import NextAuth from "next-auth"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"
import type { Adapter } from "next-auth/adapters"
import { getUserByEmailOrUsername } from "./users"
import bcrypt from "bcryptjs"

// Lazy load client promise
const getClientPromise = async () => {
  const { default: clientPromise } = await import("./client")
  return clientPromise
}

export const authOptions = {
  adapter: MongoDBAdapter(getClientPromise()) as Adapter,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        emailOrUsername: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.emailOrUsername || !credentials?.password) {
          return null
        }
        const user = await getUserByEmailOrUsername(credentials.emailOrUsername as string)

        if (user && !user.error && user.password && bcrypt.compareSync(credentials.password as string, user.password)) {
          return {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          }
        }
        return null
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role as string
        (session.user as any).id = token.id as string
      }
      return session
    },
  },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)
