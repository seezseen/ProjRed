import { auth } from "./auth";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Helper to get session in Pages API routes
 * Since NextAuth v5's auth() is designed for App Router,
 * we need this wrapper for Pages API compatibility
 */
export async function getSessionForPagesApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // For Pages API, we can extract the session from cookies
  // This is a workaround since auth() doesn't accept req/res
  try {
    const session = await auth();
    return session;
  } catch (error) {
    console.error("Session error:", error);
    return null;
  }
}
