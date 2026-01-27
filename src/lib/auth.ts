import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import { getUserByEmail } from "./db"

const SALT_ROUNDS = 10

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createSession(userId: number, email: string, role: string) {
  const cookieStore = await cookies()
  const sessionData = JSON.stringify({ userId, email, role, createdAt: Date.now() })

  // Set HTTP-only cookie for security
  cookieStore.set("session", sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })
}

export async function getSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get("session")

  if (!session) return null

  try {
    return JSON.parse(session.value)
  } catch {
    return null
  }
}

export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}

export async function requireAuth() {
  const session = await getSession()
  if (!session) {
    return null
  }

  // Verify user still exists
  const user = await getUserByEmail(session.email)
  if (!user) {
    await destroySession()
    return null
  }

  return { id: user.id, email: user.email, fullName: user.full_name, role: user.role }
}

export async function requireAdmin() {
  const user = await requireAuth()
  if (!user || user.role !== "admin") {
    return null
  }
  return user
}
