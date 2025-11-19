import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

// Force Node.js runtime instead of Edge runtime
export const runtime = 'nodejs'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAdmin = req.auth?.user?.role === 'admin' || req.auth?.user?.role === 'founder'
  const isFounder = req.auth?.user?.role === 'founder'
  
  // Protected admin routes
  if (req.nextUrl.pathname.startsWith('/upload') || req.nextUrl.pathname.startsWith('/admin')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }
  
  // Founder-only routes
  if (req.nextUrl.pathname.startsWith('/admin/users')) {
    if (!isFounder) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }
  
  // Profile routes (any authenticated user)
  if (req.nextUrl.pathname.startsWith('/profile')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: ['/upload/:path*', '/admin/:path*', '/profile/:path*'],
}
